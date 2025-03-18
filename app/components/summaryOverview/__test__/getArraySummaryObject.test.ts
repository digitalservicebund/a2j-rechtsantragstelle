import { getArraySummaryObject } from "../getArraySummaryObject";
import { SummaryOverviewBoxItemType } from "../SummaryOverviewBoxItem";

describe("getArraySummaryObject", () => {
  it("should return an array object given the box items fields and mock user data", () => {
    const mockBoxItems = [
      { inlineItems: [{ field: "weiterePersonen#test" }] },
      {
        inlineItems: [
          { field: "weiterePersonen#vorname" },
          { field: "weiterePersonen#nachname" },
        ],
      },
    ];

    const mockUserData = {
      weiterePersonen: [
        {
          test: "test",
          vorname: "vorname",
          nachname: "nachname",
        },
      ],
    };

    const actual = getArraySummaryObject(mockBoxItems, mockUserData);

    expect(actual).toEqual([
      {
        test: "test",
        vorname: "vorname",
        nachname: "nachname",
      },
    ]);
  });

  it("should return an undefined object given the boxItems not existing array object from the boxItems", () => {
    const mockBoxItems = [
      { inlineItems: [{ field: "weiterePersonen#test" }] },
      { inlineItems: [{ field: "weiterePersonen#test2" }] },
    ];

    const mockUserData = {
      weiterePersonen2: [
        {
          test: "1",
          test2: "2",
        },
      ],
    };

    const actual = getArraySummaryObject(mockBoxItems, mockUserData);

    expect(actual).toBeUndefined();
  });

  it("should return an undefined object given an empty mock user data", () => {
    const mockBoxItems = [
      { inlineItems: [{ field: "weiterePersonen#test" }] },
      { inlineItems: [{ field: "weiterePersonen#test2" }] },
    ];

    const mockUserData = {};

    const actual = getArraySummaryObject(mockBoxItems, mockUserData);

    expect(actual).toBeUndefined();
  });

  it("should return an undefined object given empty boxItems", () => {
    const mockBoxItems: SummaryOverviewBoxItemType[] = [];

    const mockUserData = {
      weiterePersonen2: [
        {
          test: "1",
          test2: "2",
        },
      ],
    };

    const actual = getArraySummaryObject(mockBoxItems, mockUserData);

    expect(actual).toBeUndefined();
  });
});
