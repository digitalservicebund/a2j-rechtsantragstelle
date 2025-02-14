import { getInlineItemValues } from "../getInlineItemValues";

const mockUserData = {
  street: "street",
  plz: "plz",
  ort: "ort",
};

describe("getInlineItemValues", () => {
  it("should return empty given undefined inlineItems", () => {
    const actual = getInlineItemValues(mockUserData, {});

    expect(actual).toBe("");
  });

  it("should return the correct data given an inline item values", () => {
    const mockInlineItems = [
      {
        field: "street",
      },
      {
        field: "plz",
      },
      {
        field: "ort",
      },
    ];

    const actual = getInlineItemValues(mockUserData, {}, mockInlineItems);

    expect(actual).toBe("street plz ort");
  });
});
