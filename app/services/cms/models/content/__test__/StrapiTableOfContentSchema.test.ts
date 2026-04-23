import { StrapiTableOfContentsSchema } from "../StrapiTableOfContents";

describe("StrapiTableOfContentSchema", () => {
  it("should return false given empty container", () => {
    const emptyContainer = {
      label: null,
      identifier: null,
      heading: null,
      buttons: [],
      links: [],
    };

    const actual = StrapiTableOfContentsSchema.safeParse(emptyContainer);

    expect(actual.success).toBe(false);
  });

  it("should return true given container", () => {
    const withContainer = {
      id: 10,
      identifier: null,
      label: null,
      heading: null,
      buttons: [],
      links: [],
      __component: "page.table-of-contents",
    };

    const actual = StrapiTableOfContentsSchema.safeParse(withContainer);

    expect(actual.success).toBe(true);
    expect(actual.data).toEqual({
      id: 10,
      label: undefined,
      heading: undefined,
      buttons: [],
      links: [],
      __component: "page.table-of-contents",
    });
  });
});
