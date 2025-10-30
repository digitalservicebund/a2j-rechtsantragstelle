import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  doneFunction,
  getPageSchema,
  getAllFieldsFromFlowId,
  getRelevantPageSchemasForStepId,
  xStateTargetsFromPagesConfig,
} from "../pageSchemas";
import { integerSchema } from "~/services/validation/integer";
import z from "zod";
import { createDateSchema } from "~/services/validation/date";

describe("getPageSchema", () => {
  it("should return the page schema for the current step", () => {
    expect(
      getPageSchema("/beratungshilfe/vorabcheck/rechtsschutzversicherung"),
    ).toStrictEqual({ rechtsschutzversicherung: YesNoAnswer });
  });

  it("should return undefined if no page schema is found", () => {
    expect(getPageSchema("/step-does-not-exist")).toBeUndefined();
  });

  describe("array pages", () => {
    it("should handle simple array pages", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahme/0/daten",
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("einnahmen#beschreibung");
      expect(result).toHaveProperty("einnahmen#betrag");
    });

    it("should handle different array indexes", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahme/5/daten",
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("einnahmen#beschreibung");
      expect(result).toHaveProperty("einnahmen#betrag");
    });

    it("should return undefined for non-existent array pages", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahme/0/non-existent",
      );
      expect(result).toBeUndefined();
    });

    it("should return undefined for non-existent nested array pages", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/non-existent",
      );
      expect(result).toBeUndefined();
    });

    it("should return undefined for pages without arrayPages", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/simple-page/0/field",
      );
      expect(result).toBeUndefined();
    });

    it("should handle multiple array indexes in the path", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahme/0/daten/1/subfield",
      );
      expect(result).toBeUndefined(); // This should return undefined as it's not a valid path structure
    });
    it("should return undefined for invalid nested path structure", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/finanzielle-angaben/eigentum-zusammenfassung/invalid/0/art",
      );
      expect(result).toBeUndefined();
    });
  });

  describe("edge cases", () => {
    it("should handle empty pathname", () => {
      expect(getPageSchema("")).toBeUndefined();
    });

    it("should handle pathname with only flow ID", () => {
      expect(getPageSchema("/prozesskostenhilfe/formular")).toBeUndefined();
    });

    it("should handle pathname with multiple consecutive slashes", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahme//0//daten",
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("einnahmen#beschreibung");
      expect(result).toHaveProperty("einnahmen#betrag");
    });

    it("should handle pathname with only slashes", () => {
      expect(getPageSchema("///")).toBeUndefined();
    });

    it("should handle pathname with mixed valid and invalid parts", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahme/0/daten/invalid",
      );
      expect(result).toBeUndefined();
    });
  });
});

describe("doneFunction", () => {
  it("should return false when no relevant pageSchemas are found", async () => {
    expect(await doneFunction({}, {})).toBe(false);
  });

  it("should return false if the given context doesn't conform to the pageSchema", async () => {
    expect(
      await doneFunction(
        {
          testPage: {
            stepId: "testPage",
            pageSchema: {
              testField: stringRequiredSchema,
            },
          },
        },
        {},
      ),
    ).toBe(false);
    expect(
      await doneFunction(
        {
          testPage: {
            stepId: "testPage",
            pageSchema: {
              testField: stringRequiredSchema,
            },
          },
        },
        { testField: undefined },
      ),
    ).toBe(false);
    expect(
      await doneFunction(
        {
          testPage: {
            stepId: "testPage",
            pageSchema: {
              testField: stringRequiredSchema,
            },
          },
        },
        { testField: 12345 as unknown as string },
      ),
    ).toBe(false);
    expect(
      await doneFunction(
        {
          testPage: {
            stepId: "testPage",
            pageSchema: {
              testField: stringRequiredSchema,
            },
          },
          testPage2: {
            stepId: "testPage2",
            pageSchema: {
              testField2: integerSchema,
            },
          },
        },
        {
          testField: "string",
        },
        ["/testPage", "/testPage2"],
      ),
    ).toBe(false);
  });

  it("should filter out unreachable pageSchemas", async () => {
    expect(
      await doneFunction(
        {
          testPage: {
            stepId: "testPage",
            pageSchema: {
              testField: stringRequiredSchema,
            },
          },
          unreachableTestPage: {
            stepId: "unreachable",
            pageSchema: {
              testField2: integerSchema,
            },
          },
        },
        {
          testField: "string",
        },
        ["/testPage"],
      ),
    ).toBe(true);
  });

  it("should filter out pageSchemas without actual schemas", async () => {
    expect(
      await doneFunction(
        {
          testPage: {
            stepId: "testPage",
            pageSchema: {
              testField: stringRequiredSchema,
            },
          },
          noPageSchema: {
            stepId: "noPageSchema",
          },
        },
        {
          testField: "string",
        },
        ["/testPage"],
      ),
    ).toBe(true);
  });

  it("should correctly validate against arrays", async () => {
    expect(
      await doneFunction(
        {
          testArrayPage: {
            stepId: "testArrayPage",
            pageSchema: {
              kinder: z.array(
                z.object({
                  vorname: stringRequiredSchema,
                  nachname: stringRequiredSchema,
                  geburtsdatum: createDateSchema(),
                }),
              ),
              hasKinder: z.enum(["yes", "no"]),
            },
            arrayPages: {
              name: {
                pageSchema: {
                  "kinder#vorname": stringRequiredSchema,
                  "kinder#nachname": stringRequiredSchema,
                  "kinder#geburtsdatum": createDateSchema(),
                },
              },
            },
          },
        },
        {
          hasKinder: "yes",
          kinder: [
            {
              vorname: "Clara",
              nachname: "Mustermann",
              geburtsdatum: "01.01.2005",
            },
          ],
        },
        ["/testArrayPage"],
        {
          testArrayPage: {
            event: "add-kinder",
            url: "/testArrayPage",
            initialInputUrl: "",
            statementKey: "hasKinder",
          },
        },
      ),
    ).toBe(true);
    expect(
      await doneFunction(
        {
          testArrayPage: {
            stepId: "testArrayPage",
            pageSchema: {
              kinder: z.array(
                z.object({
                  vorname: stringRequiredSchema,
                  nachname: stringRequiredSchema,
                  geburtsdatum: createDateSchema(),
                }),
              ),
              hasKinder: z.enum(["yes", "no"]),
            },
            arrayPages: {
              name: {
                pageSchema: {
                  "kinder#vorname": stringRequiredSchema,
                  "kinder#nachname": stringRequiredSchema,
                  "kinder#geburtsdatum": createDateSchema(),
                },
              },
            },
          },
        },
        {
          hasKinder: "no",
          kinder: [
            {
              vorname: "Clara",
              nachname: "Mustermann",
              geburtsdatum: "01.01.2005",
            },
          ],
        },
        ["/testArrayPage"],
        {
          testArrayPage: {
            event: "add-kinder",
            url: "/testArrayPage",
            initialInputUrl: "",
            statementKey: "hasKinder",
          },
        },
      ),
    ).toBe(false);
    expect(
      await doneFunction(
        {
          testArrayPage: {
            stepId: "testArrayPage",
            pageSchema: {
              kinder: z.array(
                z.object({
                  vorname: stringRequiredSchema,
                  nachname: stringRequiredSchema,
                  geburtsdatum: createDateSchema(),
                }),
              ),
              hasKinder: z.enum(["yes", "no"]),
            },
            arrayPages: {
              name: {
                pageSchema: {
                  "kinder#vorname": stringRequiredSchema,
                  "kinder#nachname": stringRequiredSchema,
                  "kinder#geburtsdatum": createDateSchema(),
                },
              },
            },
          },
        },
        {
          hasKinder: "yes",
          kinder: [
            {
              vorname: "Clara",
              nachname: "Mustermann",
              geburtsdatum: undefined as unknown as string,
            },
          ],
        },
        ["/testArrayPage"],
        {
          testArrayPage: {
            event: "add-kinder",
            url: "/testArrayPage",
            initialInputUrl: "",
            statementKey: "hasKinder",
          },
        },
      ),
    ).toBe(false);
  });
});

describe("getRelevantPageSchemasForStepId", () => {
  it("retrieves relevant pageSchemas given a flowId and stepId", () => {
    expect(
      getRelevantPageSchemasForStepId("/beratungshilfe/antrag", "/start"),
    ).toEqual({
      start: {
        stepId: "start",
      },
    });

    const { weitereAngaben } = getRelevantPageSchemasForStepId(
      "/beratungshilfe/antrag",
      "/weitere-angaben",
    );
    expect(weitereAngaben).toHaveProperty("stepId", "weitere-angaben");
    expect(weitereAngaben.pageSchema).toHaveProperty("weitereAngaben");
    const { bereich, situationBeschreibung } = getRelevantPageSchemasForStepId(
      "/beratungshilfe/antrag",
      "/rechtsproblem",
    );
    expect(bereich).toHaveProperty("stepId", "rechtsproblem/bereich");
    expect(bereich.pageSchema).toHaveProperty("bereich");
    expect(situationBeschreibung).toHaveProperty(
      "stepId",
      "rechtsproblem/situation-beschreibung",
    );
    expect(situationBeschreibung.pageSchema).toHaveProperty("gegenseite");
  });
});

describe("xStateTargetsFromPageSchema", () => {
  it("should map a PagesConfig to its equivalent xState targets", () => {
    const pagesConfig = {
      testPage: {
        stepId: "parent/child/target",
        pageSchema: {
          testField: stringRequiredSchema,
        },
      },
    };
    expect(xStateTargetsFromPagesConfig(pagesConfig)).toStrictEqual({
      testPage: {
        absolute: "#parent.child.target",
        relative: "target",
      },
    });
  });
});

describe("getAllFieldsFromFlowId", () => {
  it("should return specific the fields for the page /rechtsschutzversicherung for the flow id /beratungshilfe/vorabcheck", () => {
    const fields = getAllFieldsFromFlowId("/beratungshilfe/vorabcheck");

    expect(fields["/rechtsschutzversicherung"]).toEqual([
      "rechtsschutzversicherung",
    ]);
  });

  it("should return specific the fields for array pages in the flow id /beratungshilfe/antrag", () => {
    const fields = getAllFieldsFromFlowId("/beratungshilfe/antrag");

    expect(fields["/finanzielle-angaben/kinder/kinder/name"]).toEqual([
      "kinder#vorname",
      "kinder#nachname",
      "kinder#geburtsdatum",
    ]);
  });

  it("should not return specific array pages without schema in the flow id /beratungshilfe/antrag", () => {
    const fields = getAllFieldsFromFlowId("/beratungshilfe/antrag");

    expect(fields).not.toHaveProperty(
      "/finanzielle-angaben/kinder/kinder/kind-unterhalt-ende",
    );
  });
});
