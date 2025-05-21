import { StrapiTableOfContentsSchema } from "../StrapiTableOfContents";

describe("StrapiTableOfContentSchema", () => {
  it("should return false given empty container", () => {
    const emptyContainer = {
      label: null,
      heading: null,
      buttons: [],
      outerBackground: null,
      container: null,
      links: [],
    };

    const actual = StrapiTableOfContentsSchema.safeParse(emptyContainer);

    expect(actual.success).toBe(false);
  });

  it("should return true given container", () => {
    const withContainer = {
      label: null,
      heading: null,
      buttons: [],
      outerBackground: null,
      container: {
        backgroundColor: "blue",
        paddingBottom: "default",
        paddingTop: "default",
      },
      links: [],
    };

    const actual = StrapiTableOfContentsSchema.safeParse(withContainer);

    expect(actual.success).toBe(true);
    expect(actual.data).toEqual({
      label: undefined,
      heading: undefined,
      buttons: [],
      outerBackground: null,
      container: {
        backgroundColor: "blue",
        paddingBottom: "default",
        paddingTop: "default",
      },
      links: [],
      __component: "page.table-of-contents",
    });
  });
});
