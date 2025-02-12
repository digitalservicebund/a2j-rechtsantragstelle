import { StrapiSummaryOverviewSchema } from "../StrapiSummaryOverview";

describe("StrapiSummaryOverviewSchema", () => {
  it("should return success false given empty navigation", () => {
    const emptyNavigation = {
      __component: "page.summary-overview",
      navigation: [],
    };

    const actual = StrapiSummaryOverviewSchema.safeParse(emptyNavigation);

    expect(actual.success).toBe(false);
  });

  it("should return success false given empty boxes", () => {
    const emptyBoxes = {
      __component: "page.summary-overview",
      navigation: [
        {
          boxes: [],
        },
      ],
    };

    const actual = StrapiSummaryOverviewSchema.safeParse(emptyBoxes);

    expect(actual.success).toBe(false);
  });

  it("should return success true and summary overview object given correct data", () => {
    const correctSummary = {
      __component: "page.summary-overview",
      navigation: [
        {
          boxes: [
            {
              stepId: "anyStep",
              id: 10,
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
          boxes: [
            {
              stepId: "anyStep",
              id: 10,
            },
          ],
          id: 10,
        },
      ],
      __component: "page.summary-overview",
    });
  });
});
