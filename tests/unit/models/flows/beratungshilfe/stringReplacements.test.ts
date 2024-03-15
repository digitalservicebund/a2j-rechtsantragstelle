import { happyPathData } from "tests/fixtures/beratungshilfeFormularData";
import { getKinderStrings } from "~/models/flows/beratungshilfeFormular/stringReplacements";

describe("getKinderStrings", () => {
  it("returns correct property for one array index", () => {
    const kinderStringReplacement = getKinderStrings({
      ...happyPathData,
      pageData: { arrayIndexes: [0] },
    });
    expect(kinderStringReplacement).toEqual({
      "kind#index": "1",
      "kind#vorname": happyPathData.kinder?.[0]?.vorname,
      "kind#nachname": happyPathData.kinder?.[0]?.nachname,
    });
  });
  it("returns correct property for multiple array indexes", () => {
    const kinderStringReplacement = getKinderStrings({
      ...happyPathData,
      pageData: { arrayIndexes: [1, 2] },
    });
    expect(kinderStringReplacement).toEqual({
      "kind#index": "2",
      "kind#vorname": happyPathData.kinder?.[1]?.vorname,
      "kind#nachname": happyPathData.kinder?.[1]?.nachname,
    });
  });
  it("returns empty object when context has no kinder key", () => {
    const removedKinderFromHappyPathData = happyPathData;
    delete removedKinderFromHappyPathData.kinder;

    const kinderStringReplacement = getKinderStrings(
      removedKinderFromHappyPathData,
    );
    expect(kinderStringReplacement).toEqual({});
  });
  it("returns empty object when array indexes are undefined", () => {
    const kinderStringReplacement = getKinderStrings(happyPathData);
    expect(kinderStringReplacement).toEqual({});
  });
  it("returns empty object when array index is empty array", () => {
    // this case happens when Kinder array is created, then entries are deleted
    const kinderStringReplacement = getKinderStrings({
      ...happyPathData,
      kinder: [],
      pageData: { arrayIndexes: [0] },
    });
    expect(kinderStringReplacement).toEqual({});
  });
  it("returns empty object when array index is greater than kinder array in context", () => {
    const kinderStringReplacement = getKinderStrings({
      ...happyPathData,
      pageData: { arrayIndexes: [10] },
    });
    expect(kinderStringReplacement).toEqual({});
  });
});
