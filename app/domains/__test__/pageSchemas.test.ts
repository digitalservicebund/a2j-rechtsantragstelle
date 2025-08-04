import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { getPageSchema, xStateTargetsFromPagesConfig } from "../pageSchemas";

describe("getPageSchema", () => {
  it("should return the page schema for the current step", () => {
    expect(
      getPageSchema("/beratungshilfe/vorabcheck/rechtsschutzversicherung"),
    ).toStrictEqual({ rechtsschutzversicherung: YesNoAnswer });
  });

  it("should return undefined if no page schema is found", () => {
    expect(getPageSchema("/step-does-not-exist")).toBeUndefined();
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
