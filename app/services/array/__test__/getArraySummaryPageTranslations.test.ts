import { vi } from "vitest";
import { fetchTranslations } from "~/services/cms/index.server";
import { getArraySummaryPageTranslations } from "../getArraySummaryPageTranslations";

vi.mock("~/services/cms/index.server", () => ({
  fetchTranslations: vi.fn(),
}));

describe("getArraySummaryPageTranslations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call fetchTranslations for each category in arrayCategories and 'arrayLabels'", async () => {
    const arrayCategories = ["ausgaben", "wertsachen"];
    const mockTranslations = { key: "value" };
    vi.mocked(fetchTranslations).mockResolvedValue(mockTranslations);

    await getArraySummaryPageTranslations(arrayCategories);

    expect(fetchTranslations).toHaveBeenCalledTimes(3); // 2 categories + "arrayLabels"
    expect(fetchTranslations).toHaveBeenCalledWith("ausgaben");
    expect(fetchTranslations).toHaveBeenCalledWith("wertsachen");
    expect(fetchTranslations).toHaveBeenCalledWith("arrayLabels");
  });

  it("should return merged translations", async () => {
    const arrayCategories = ["ausgaben", "wertsachen"];
    const ausgabenTranslations = { ausgabenKey: "ausgabenValue" };
    const wertsachenTranslations = { wertsachenKey: "wertsachenValue" };
    const arrayLabelsTranslations = { arrayLabelsKey: "arrayLabelsValue" };
    vi.mocked(fetchTranslations)
      .mockResolvedValueOnce(ausgabenTranslations)
      .mockResolvedValueOnce(wertsachenTranslations)
      .mockResolvedValueOnce(arrayLabelsTranslations);

    const result = await getArraySummaryPageTranslations(arrayCategories);

    expect(result).toEqual({
      ausgabenKey: "ausgabenValue",
      wertsachenKey: "wertsachenValue",
      arrayLabelsKey: "arrayLabelsValue",
    });
  });

  it("should handle empty arrayCategories", async () => {
    const arrayCategories: string[] = [];
    const arrayLabelsTranslations = { arrayLabelsKey: "arrayLabelsValue" };
    vi.mocked(fetchTranslations).mockResolvedValueOnce(arrayLabelsTranslations);

    const result = await getArraySummaryPageTranslations(arrayCategories);

    expect(fetchTranslations).toHaveBeenCalledTimes(1);
    expect(fetchTranslations).toHaveBeenCalledWith("arrayLabels");
    expect(result).toEqual({ arrayLabelsKey: "arrayLabelsValue" });
  });
});
