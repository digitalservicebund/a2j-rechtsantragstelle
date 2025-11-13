import z from "zod";
import {
  isStepDone,
  getRelevantPageSchemasForStepId,
} from "~/services/flow/server/isStepDone/isStepDone";
import { type PagesConfig } from "~/domains/pageSchemas";
import { type ArrayConfigServer } from "~/services/array";
import { createDateSchema } from "~/services/validation/date";
import { integerSchema } from "~/services/validation/integer";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

const testArrayPageSchema: PagesConfig = {
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
};

const testMultipleArraysSchema: PagesConfig = {
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
      test: z.array(
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
};

const testArrayConfig: Record<string, ArrayConfigServer> = {
  testArrayPage: {
    event: "add-kinder",
    url: "/testArrayPage",
    initialInputUrl: "",
    statementKey: "hasKinder",
  },
};

const testMultipleArrayConfig: Record<string, ArrayConfigServer> = {
  arrayPage1: {
    event: "add-kinder",
    url: "/testArrayPage",
    initialInputUrl: "",
    statementKey: "hasKinder",
  },
  arrayPage2: {
    event: "add-kinder",
    url: "/testArrayPage",
    initialInputUrl: "",
    statementKey: "hasKinder",
  },
};

describe("isStepDone", () => {
  it("should return true when no relevant pageSchemas are found", () => {
    expect(isStepDone({}, {}, [])).toBe(true);
  });

  it("should return true for a pageSchema without a zod schema", () => {
    expect(
      isStepDone(
        {
          testPage: {
            stepId: "testPage",
          },
        },
        {},
        ["/testPage"],
      ),
    ).toBe(true);
  });

  it("should return false if the given context doesn't conform to the pageSchema", () => {
    expect(
      isStepDone(
        {
          testPage: {
            stepId: "testPage",
            pageSchema: {
              testField: stringRequiredSchema,
            },
          },
        },
        {},
        ["/testPage"],
      ),
    ).toBe(false);
    expect(
      isStepDone(
        {
          testPage: {
            stepId: "testPage",
            pageSchema: {
              testField: stringRequiredSchema,
            },
          },
        },
        { testField: undefined },
        ["/testPage"],
      ),
    ).toBe(false);
    expect(
      isStepDone(
        {
          testPage: {
            stepId: "testPage",
            pageSchema: {
              testField: stringRequiredSchema,
            },
          },
        },
        { testField: 12345 as unknown as string },
        ["/testPage"],
      ),
    ).toBe(false);
    expect(
      isStepDone(
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

  it("should filter out unreachable pageSchemas", () => {
    expect(
      isStepDone(
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

  it("should filter out pageSchemas without actual schemas", () => {
    expect(
      isStepDone(
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

  it("should correctly validate against arrays", () => {
    expect(
      isStepDone(
        testArrayPageSchema,
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
        testArrayConfig,
      ),
    ).toBe(true);

    // Step is done -- array irrelevant because hasKinder === 'no'
    expect(
      isStepDone(
        testArrayPageSchema,
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
        testArrayConfig,
      ),
    ).toBe(true);
    expect(
      isStepDone(
        testArrayPageSchema,
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
        testArrayConfig,
      ),
    ).toBe(false);
  });

  it("should return false when a page has multiple optional arrays and none are filled out", () => {
    expect(
      isStepDone(
        testMultipleArraysSchema,
        {
          hasKinder: "yes",
          kinder: [],
        },
        ["/arrayPage1", "/arrayPage2"],
        testMultipleArrayConfig,
      ),
    ).toBe(false);
  });
  it("should return false when a page has multiple optional arrays and at least one is filled out, but other data is missing", () => {
    expect(
      isStepDone(
        testMultipleArraysSchema,
        {
          hasKinder: "yes",
          kinder: [],
        },
        ["/arrayPage1", "/arrayPage2"],
        testMultipleArrayConfig,
      ),
    ).toBe(false);
  });

  it("should return true when a page has multiple optional arrays and at least one is filled out", () => {
    expect(
      isStepDone(
        testMultipleArraysSchema,
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
        ["/arrayPage1", "/arrayPage2"],
        testMultipleArrayConfig,
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

  it("returns an empty object when the given flowId has no pageSchemas", () => {
    expect(
      getRelevantPageSchemasForStepId("/fluggastrechte/formular", "/start"),
    ).toEqual({});
  });
});
