import { getFontSizeFieldValue } from "~/services/pdf/getFontSizeFieldValue";

describe("getFontSizeFieldValue", () => {
  it("should return font size 5 for field name D3-Teilwohnkosten", () => {
    const actual = getFontSizeFieldValue("D3-Teilwohnkosten");

    expect(actual).toEqual(5);
  });

  it("should return font size 10 for any another field name", () => {
    const actual = getFontSizeFieldValue("any_another_field_name");

    expect(actual).toEqual(10);
  });
});
