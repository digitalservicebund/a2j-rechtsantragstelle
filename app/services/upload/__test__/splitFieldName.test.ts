import { splitFieldName } from "../splitFieldName";

describe("splitFieldName", () => {
  it("should split a field name into the parent field and the index", () => {
    const { fieldName, inputIndex } = splitFieldName("fieldName[0]");
    expect(fieldName).toEqual("fieldName");
    expect(inputIndex).toEqual(0);
  });

  it("should handle an invalid input name", () => {
    const { fieldName, inputIndex } = splitFieldName("fieldName");
    expect(fieldName).toEqual("fieldName");
    expect(inputIndex).toEqual(NaN);
  });

  it("should handle two-digit indices", () => {
    const { inputIndex } = splitFieldName("fieldName[10]");
    expect(inputIndex).toEqual(10);
  });
});
