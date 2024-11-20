import { addPageDataToUserData } from "~/services/flow/pageData";
import {
  firstArrayIndex,
  isValidArrayIndex,
} from "~/services/flow/pageDataSchema";

describe("addPageDataToUserData()", () => {
  it("add pageData", () => {
    expect(addPageDataToUserData({}, { arrayIndexes: [] })).toStrictEqual({
      pageData: { arrayIndexes: [] },
    });
  });
});

describe("firstArrayIndex()", () => {
  it("return undefined for missing pagedata", () => {
    expect(firstArrayIndex()).toBeUndefined();
  });

  it("return undefined for empty arrayIndexes", () => {
    expect(firstArrayIndex({ arrayIndexes: [] })).toBeUndefined();
  });

  it("returns first valid index", () => {
    expect(firstArrayIndex({ arrayIndexes: [2] })).toEqual(2);
  });
});

describe("isValidArrayIndex()", () => {
  it("return true for available array entry", () => {
    expect(isValidArrayIndex(["a"], { arrayIndexes: [0] })).toBeTruthy();
  });

  it("return true for next array entry", () => {
    expect(isValidArrayIndex(["a"], { arrayIndexes: [1] })).toBeTruthy();
  });

  it("return true for missing array at array index 0", () => {
    expect(isValidArrayIndex(undefined, { arrayIndexes: [0] })).toBeTruthy();
  });
  it("return true for empty array at array index 0", () => {
    expect(isValidArrayIndex([], { arrayIndexes: [0] })).toBeTruthy();
  });

  it("return false for missing array at other array indexes", () => {
    expect(isValidArrayIndex(undefined, { arrayIndexes: [1] })).toBeFalsy();
  });

  it("return false for missing pagedata", () => {
    expect(isValidArrayIndex([])).toBeFalsy();
  });

  it("return false for undefined pagedata", () => {
    expect(isValidArrayIndex([])).toBeFalsy();
  });

  it("return false for empty arrayIndexes", () => {
    expect(isValidArrayIndex([], { arrayIndexes: [] })).toBeFalsy();
  });

  it("return false for negative arrayIndexes", () => {
    expect(isValidArrayIndex(["a"], { arrayIndexes: [-1] })).toBeFalsy();
  });

  it("return false for too large arrayIndexes", () => {
    expect(isValidArrayIndex(["a"], { arrayIndexes: [2] })).toBeFalsy();
  });
});
