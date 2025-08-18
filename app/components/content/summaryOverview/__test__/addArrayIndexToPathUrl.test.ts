import { addArrayIndexToPathUrl } from "../addArrayIndexToPathUrl";

describe("addArrayIndexToPathUrl", () => {
  it("should return the path when it does not contain slashes", () => {
    const pathWithoutSlashes = "pathWithoutSlashes";
    const actual = addArrayIndexToPathUrl(pathWithoutSlashes, 2);

    expect(actual).toEqual(pathWithoutSlashes);
  });

  it("should return the correct path given the index of the array", () => {
    const pathWithoutSlashes =
      "/persoenliche-daten/weitere-personen/person/daten";
    const actual = addArrayIndexToPathUrl(pathWithoutSlashes, 2);

    expect(actual).toEqual(
      "/persoenliche-daten/weitere-personen/person/2/daten",
    );
  });
});
