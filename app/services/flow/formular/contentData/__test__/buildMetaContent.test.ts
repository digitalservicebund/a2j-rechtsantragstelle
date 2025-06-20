import { fluggastrechteVorabcheck } from "~/domains/fluggastrechte/vorabcheck";
import { buildMetaContent } from "../buildMetaContent";

const mockParentMeta = {
  description: "parentMeta description",
  ogTitle: "parentMeta ogTitle",
  breadcrumb: "parentMeta breadcrumb",
  title: "parentMeta title",
};

const mockUserData = {
  name: "testName",
  pageData: { arrayIndexes: [] },
};

describe("buildMetaContent", () => {
  it("should fall back to parent meta values when page meta's description and ogTitle are null", () => {
    const pageMetaWithoutDescriptionAndOgTile = {
      description: null,
      ogTitle: null,
      breadcrumb: "pageMeta breadcrumb",
      title: "pageMeta title",
    };

    const actual = buildMetaContent(
      fluggastrechteVorabcheck,
      pageMetaWithoutDescriptionAndOgTile,
      mockParentMeta,
      mockUserData,
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

    const actual = buildMetaContent(
      fluggastrechteVorabcheck,
      pageMetaWithoutDescriptionAndOgTile,
      mockParentMeta,
      mockUserData,
    );

    expect(actual.description).toBe("pageMeta description");
    expect(actual.ogTitle).toBe("pageMeta ogTitle");
  });

  it("should inherit breadcrumb from parent meta regardless of page meta value", () => {
    const pageMetaWithoutDescriptionAndOgTile = {
      description: "pageMeta description",
      ogTitle: "pageMeta ogTitle",
      breadcrumb: "pageMeta breadcrumb",
      title: "pageMeta title",
    };

    const actual = buildMetaContent(
      fluggastrechteVorabcheck,
      pageMetaWithoutDescriptionAndOgTile,
      mockParentMeta,
      mockUserData,
    );

    expect(actual.breadcrumb).toBe("parentMeta breadcrumb");
  });

  it("should return correct the title", () => {
    const pageMetaWithoutDescriptionAndOgTile = {
      description: "pageMeta description",
      ogTitle: "pageMeta ogTitle",
      breadcrumb: "pageMeta breadcrumb",
      title: "pageMeta title",
    };

    const actual = buildMetaContent(
      fluggastrechteVorabcheck,
      pageMetaWithoutDescriptionAndOgTile,
      mockParentMeta,
      mockUserData,
    );

    expect(actual.title).toBe("pageMeta title - parentMeta title");
  });
});
