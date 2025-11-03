import z from "zod";
import {
  isStepDone,
  getRelevantPageSchemasForStepId,
} from "~/domains/isStepDone";
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

const testArrayConfig: Record<string, ArrayConfigServer> = {
  testArrayPage: {
    event: "add-kinder",
    url: "/testArrayPage",
    initialInputUrl: "",
    statementKey: "hasKinder",
  },
};

describe("isStepDone", () => {
  it("should return true when no relevant pageSchemas are found", async () => {
    expect(await isStepDone({}, {}, [])).toBe(true);
  });

  it("should return true for a pageSchema without a zod schema", async () => {
    expect(
      await isStepDone(
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

  it("should return false if the given context doesn't conform to the pageSchema", async () => {
    expect(
      await isStepDone(
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
      await isStepDone(
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
      await isStepDone(
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
      await isStepDone(
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
      await isStepDone(
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
      await isStepDone(
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
      await isStepDone(
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
      await isStepDone(
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
      await isStepDone(
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
