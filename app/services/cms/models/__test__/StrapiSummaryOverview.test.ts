import { StrapiSummaryOverviewSectionSchema } from "../StrapiSummaryOverviewSection";

describe("StrapiSummaryOverviewSchema", () => {
  it("should return false given empty boxes", () => {
    const emptyNavigation = {
      __component: "page.summary-overview-section",
      title: {
        text: "text",
        tagName: "h1",
        look: "default",
        id: 1,
      },
      boxes: [],
    };

    const actual =
      StrapiSummaryOverviewSectionSchema.safeParse(emptyNavigation);

    expect(actual.success).toBe(false);
  });

  it("should return false given empty boxes items", () => {
    const emptyBoxes = {
      __component: "page.summary-overview-section",
      title: {
        text: "text",
        tagName: "h1",
        look: "default",
        id: 1,
      },
      boxes: [
        {
          stepId: "anyStep",
          id: 10,
          boxItems: [],
        },
      ],
    };

    const actual = StrapiSummaryOverviewSectionSchema.safeParse(emptyBoxes);

    expect(actual.success).toBe(false);
  });

  it("should return true and summary overview object given correct data", () => {
    const correctSummary = {
      __component: "page.summary-overview-section",
      title: {
        text: "text",
        tagName: "h1",
        look: "default",
        id: 1,
      },
      boxes: [
        {
          stepId: "anyStep",
          id: 10,
          title: null,
          boxItems: [
            {
              field: "one",
            },
          ],
        },
      ],
      id: 10,
    };

    const actual = StrapiSummaryOverviewSectionSchema.safeParse(correctSummary);

    expect(actual.success).toBe(true);
    expect(actual.data).toEqual({
      title: {
        __component: "basic.heading",
        text: "text",
        tagName: "h1",
        look: "default",
        id: 1,
      },
      boxes: [
        {
          stepId: "anyStep",
          id: 10,
          boxItems: [
            {
              field: "one",
            },
          ],
        },
      ],
      id: 10,
      __component: "page.summary-overview-section",
    });
  });
});
