import { getBackButtonDestination } from "../getBackButtonDestination";

describe("getBackButtonDestination", () => {
  it("should return back button destination with arrayIndex in case arrayIndexes is defined", () => {
    const actual = getBackButtonDestination(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/1/name",
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/wohnort",
      [1],
    );

    expect(actual).toBe(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/1/name",
    );
  });

  it("should return back button destination from the destination parameter in case arrayIndexes is empty", () => {
    const actual = getBackButtonDestination(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/",
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/wohnort",
      [],
    );

    expect(actual).toBe("/beratungshilfe/antrag/finanzielle-angaben/kinder/");
  });
});
