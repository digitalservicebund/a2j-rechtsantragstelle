import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { getPageSchema } from "../pageSchemas";

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
