import { stepMeta } from "../stepMeta";

const mockParentMeta = {
  description: "parentMeta description",
  ogTitle: "parentMeta ogTitle",
  breadcrumb: "parentMeta breadcrumb",
  title: "parentMeta title",
};

describe("stepMeta", () => {
  it("should fall back to parent meta values when page meta's description and ogTitle are null", () => {
    const pageMetaWithoutDescriptionAndOgTile = {
      breadcrumb: "pageMeta breadcrumb",
      title: "pageMeta title",
    };

    const actual = stepMeta(
      pageMetaWithoutDescriptionAndOgTile,
      mockParentMeta,
    );

    expect(actual.description).toBe("parentMeta description");
    expect(actual.ogTitle).toBe("parentMeta ogTitle");
  });

  it("should not overwrite the meta if description and ogTitle are not null for the pageMeta ", () => {
    const pageMetaWithoutDescriptionAndOgTile = {
      description: "pageMeta description",
      ogTitle: "pageMeta ogTitle",
      breadcrumb: "pageMeta breadcrumb",
      title: "pageMeta title",
    };

    const actual = stepMeta(
      pageMetaWithoutDescriptionAndOgTile,
      mockParentMeta,
    );

    expect(actual.description).toBe("pageMeta description");
    expect(actual.ogTitle).toBe("pageMeta ogTitle");
  });

  it("should combine the page title with parent title using a hyphen delimiter", () => {
    const pageMetaWithoutDescriptionAndOgTile = {
      description: "pageMeta description",
      ogTitle: "pageMeta ogTitle",
      breadcrumb: "pageMeta breadcrumb",
      title: "pageMeta title",
    };

    const actual = stepMeta(
      pageMetaWithoutDescriptionAndOgTile,
      mockParentMeta,
    );

    expect(actual.title).toBe("pageMeta title - parentMeta title");
  });
});
