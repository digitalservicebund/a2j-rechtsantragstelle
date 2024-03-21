import { addPageDataToUserData } from "~/services/flow/pageData";

describe("addPageDataToUserData()", () => {
  it("add pageData", () => {
    expect(addPageDataToUserData({}, { arrayIndexes: [] })).toStrictEqual({
      pageData: { arrayIndexes: [] },
    });
  });
});
