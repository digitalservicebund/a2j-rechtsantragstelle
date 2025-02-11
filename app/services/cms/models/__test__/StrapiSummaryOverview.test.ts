import { StrapiSummaryOverviewSchema } from "../StrapiSummaryOverview";

describe("StrapiSummaryOverviewSchema", () => {
  it("should return success false given empty navigation", () => {
    const emptyNavigation = {
      navigation: [],
    };

    const actual = StrapiSummaryOverviewSchema.safeParse(emptyNavigation);

    expect(actual.success).toBe(false);
  });

  it("should return success false given empty boxes", () => {
    const emptyBoxes = {
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
