import { StrapiSummaryOverviewSchema } from "../StrapiSummaryOverview";

describe("StrapiSummaryOverviewSchema", () => {
  it("should return false given empty navigation", () => {
    const emptyNavigation = {
      __component: "page.summary-overview",
      navigation: [],
    };

    const actual = StrapiSummaryOverviewSchema.safeParse(emptyNavigation);

    expect(actual.success).toBe(false);
  });

  it("should return false given empty boxes", () => {
    const emptyBoxes = {
      __component: "page.summary-overview",
      navigation: [
        {
          title: {
            text: "text",
            tagName: "h1",
            look: "default",
            id: 1,
          },
          boxes: [],
        },
      ],
    };

    const actual = StrapiSummaryOverviewSchema.safeParse(emptyBoxes);

    expect(actual.success).toBe(false);
  });

  it("should return false given empty boxes items", () => {
    const emptyBoxes = {
      __component: "page.summary-overview",
      navigation: [
        {
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
        },
      ],
    };

    const actual = StrapiSummaryOverviewSchema.safeParse(emptyBoxes);

    expect(actual.success).toBe(false);
  });

  it("should return true and summary overview object given correct data", () => {
    const correctSummary = {
      __component: "page.summary-overview",
      navigation: [
        {
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
        },
      ],
    };

    const actual = StrapiSummaryOverviewSchema.safeParse(correctSummary);

    expect(actual.success).toBe(true);
    expect(actual.data).toEqual({
      navigation: [
        {
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
        },
      ],
      __component: "page.summary-overview",
    });
  });
});
