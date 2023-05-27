import getSlug from "~/util/getSlug";

describe("getSlug", () => {
  it("returns slug from given url", () => {
    const url = "http://example.com/segment/segment/slug?q=1";
    expect(getSlug(url)).toEqual("slug");
  });
});
