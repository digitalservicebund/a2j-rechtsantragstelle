import { isFieldEmptyOrUndefined } from "../isFieldEmptyOrUndefined";

describe("isFieldEmptyOrUndefined", () => {
  it("should return true if field is empty", () => {
    const field = "";
    const actual = isFieldEmptyOrUndefined(field);
    expect(actual).toBe(true);
  });

  it("should return true if field is undefined", () => {
    const field = undefined;
    const actual = isFieldEmptyOrUndefined(field);
    expect(actual).toBe(true);
  });

  it("should return false if field is not empty or undefined", () => {
    const field = "field";
    const actual = isFieldEmptyOrUndefined(field);
    expect(actual).toBe(false);
  });
});
