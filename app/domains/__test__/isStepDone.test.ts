import z from "zod";
import {
  isStepDone,
  getRelevantPageSchemasForStepId,
} from "~/domains/isStepDone";
import { createDateSchema } from "~/services/validation/date";
import { integerSchema } from "~/services/validation/integer";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

describe("isStepDone", () => {
  it("should return false when no relevant pageSchemas are found", async () => {
    expect(await isStepDone({}, {}, [])).toBe(false);
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
        [],
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
        [],
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
        [],
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
      await isStepDone(
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
      await isStepDone(
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
