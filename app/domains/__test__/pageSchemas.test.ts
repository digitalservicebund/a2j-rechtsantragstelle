import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  getPageSchema,
  getAllFieldsFromFlowId,
  xStateTargetsFromPagesConfig,
  pagesConfigForStepId,
  filterPageSchemasByReachableSteps,
  type PageConfig,
  getReadOnlyFields,
} from "../pageSchemas";
import { ZodType } from "zod";

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
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme/0/daten",
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("einnahmen#beschreibung");
      expect(result).toHaveProperty("einnahmen#betrag");
    });

    it("should handle different array indexes", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme/5/daten",
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("einnahmen#beschreibung");
      expect(result).toHaveProperty("einnahmen#betrag");
    });

    it("should return undefined for non-existent array pages", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme/0/non-existent",
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
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme/0/daten/1/subfield",
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
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme//0//daten",
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
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme/0/daten/invalid",
      );
      expect(result).toBeUndefined();
    });
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

describe("getRelevantPageSchemasForStepId", () => {
  it("retrieves relevant pageSchemas given a flowId and stepId", () => {
    expect(pagesConfigForStepId("/beratungshilfe/antrag", "/start")).toEqual({
      start: {
        stepId: "start",
      },
    });

    const { weitereAngaben } = pagesConfigForStepId(
      "/beratungshilfe/antrag",
      "/weitere-angaben",
    );
    expect(weitereAngaben).toEqual(
      expect.objectContaining({
        stepId: "weitere-angaben",
        pageSchema: { weitereAngaben: expect.any(ZodType) },
      }),
    );
    const { bereich, situationBeschreibung } = pagesConfigForStepId(
      "/beratungshilfe/antrag",
      "/rechtsproblem",
    );
    expect(bereich).toEqual(
      expect.objectContaining({
        stepId: "rechtsproblem/bereich",
        pageSchema: { bereich: expect.any(ZodType) },
      }),
    );
    expect(situationBeschreibung).toEqual(
      expect.objectContaining({
        stepId: "rechtsproblem/situation-beschreibung",
        pageSchema: {
          gegenseite: expect.any(ZodType),
          beschreibung: expect.any(ZodType),
          ziel: expect.any(ZodType),
          eigeninitiativeBeschreibung: expect.any(ZodType),
        },
      }),
    );
  });

  it("returns an empty object when the given flowId has no pageSchemas", () => {
    expect(pagesConfigForStepId("/fluggastrechte/formular", "/start")).toEqual(
      {},
    );
  });
});

describe("filterPageSchemasByReachableSteps", () => {
  it("should return false if the given config lacks a pageSchema property", () => {
    expect(
      filterPageSchemasByReachableSteps(
        {},
        [],
      )({
        stepId: "test",
      } as PageConfig),
    ).toBe(false);
  });

  it("should return false if the config isn't included in the reachable steps", () => {
    expect(
      filterPageSchemasByReachableSteps({}, ["/other"])({
        stepId: "test",
        pageSchema: {
          test: stringRequiredSchema,
        },
      } as PageConfig),
    ).toBe(false);
  });

  it("should return true if the config has a pageSchema and can be found in reachableSteps", () => {
    expect(
      filterPageSchemasByReachableSteps({}, ["/test"])({
        stepId: "test",
        pageSchema: {
          test: stringRequiredSchema,
        },
      } as PageConfig),
    ).toBe(true);
  });

  describe("arrayPages handling", () => {
    it("should return false if no matching arrayConfig is found", () => {
      expect(
        filterPageSchemasByReachableSteps({}, ["/test"])({
          stepId: "test",
          arrayPages: {
            test: {
              pageSchema: {},
            },
          },
        } as PageConfig),
      ).toBe(false);
    });

    it("should return false if the conditional relevance check fails (statementKey)", () => {
      expect(
        filterPageSchemasByReachableSteps({}, ["/test"], {
          arrayConfig: {
            statementKey: "hasKinder",
            event: "add-kinder",
            url: "/test",
            initialInputUrl: "",
          },
        })({
          stepId: "test",
          arrayPages: {
            test: {
              pageSchema: {},
            },
          },
        } as PageConfig),
      ).toBe(false);
    });

    it("should return true if a matching array config is found and it satisfies the conditional relevance check (statementKey)", () => {
      expect(
        filterPageSchemasByReachableSteps(
          {
            hasKinder: "yes",
          },
          ["/test"],
          {
            arrayConfig: {
              statementKey: "hasKinder",
              event: "add-kinder",
              url: "/test",
              initialInputUrl: "",
            },
          },
        )({
          stepId: "test",
          arrayPages: {
            test: {
              pageSchema: {},
            },
          },
        } as PageConfig),
      ).toBe(true);
    });
  });
});

describe("getReadOnlyFields", () => {
  it("should return undefined if there are no readOnlyFields defined for the page", () => {
    const actual = getReadOnlyFields(
      "/beratungshilfe/vorabcheck/rechtsschutzversicherung",
    );

    expect(actual).not.toBeDefined();
  });

  it("should return the readOnlyFields for the page if they are defined", () => {
    const actual = getReadOnlyFields(
      "/geld-einklagen/formular/klage-erstellen/klagende-person/kontaktdaten",
    );

    expect(actual).toBeDefined();
    expect(actual?.fieldNames).toEqual([
      "klagendePersonPlz",
      "klagendePersonOrt",
    ]);
    expect(actual?.shouldMakeReadOnly).toEqual(expect.any(Function));
  });
});
