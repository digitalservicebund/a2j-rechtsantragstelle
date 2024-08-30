import { vi } from "vitest";
import { fetchTranslations } from "~/services/cms/index.server";
import { getPageTranslations } from "../getPageTranslations";

vi.mock("~/services/cms/index.server", () => ({
  fetchTranslations: vi.fn(),
}));

describe("getPageTranslations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call fetchTranslations for each category in arrayCategories, 'arrayLabels' and the flowId", async () => {
    const arrayCategories = ["ausgaben", "wertsachen"];
    const mockTranslations = { key: "value" };
    vi.mocked(fetchTranslations).mockResolvedValue(mockTranslations);

    await getPageTranslations(arrayCategories, "anyFlow");

    expect(fetchTranslations).toHaveBeenCalledTimes(4); // 2 categories + "arrayLabels"
    expect(fetchTranslations).toHaveBeenCalledWith("ausgaben");
    expect(fetchTranslations).toHaveBeenCalledWith("wertsachen");
    expect(fetchTranslations).toHaveBeenCalledWith("arrayLabels");
    expect(fetchTranslations).toHaveBeenCalledWith("anyFlow");
  });

  it("should return merged translations", async () => {
    const arrayCategories = ["ausgaben", "wertsachen"];
    const ausgabenTranslations = { ausgabenKey: "ausgabenValue" };
    const wertsachenTranslations = { wertsachenKey: "wertsachenValue" };
    const arrayLabelsTranslations = { arrayLabelsKey: "arrayLabelsValue" };
    const anyFlowTranslations = { anyFlowKey: "anyFlowValue" };
    vi.mocked(fetchTranslations)
      .mockResolvedValueOnce(ausgabenTranslations)
      .mockResolvedValueOnce(wertsachenTranslations)
      .mockResolvedValueOnce(arrayLabelsTranslations)
      .mockResolvedValueOnce(anyFlowTranslations);

    const result = await getPageTranslations(arrayCategories, "anyFlow");

    expect(result).toEqual({
      ausgabenKey: "ausgabenValue",
      wertsachenKey: "wertsachenValue",
      arrayLabelsKey: "arrayLabelsValue",
      anyFlowKey: "anyFlowValue",
    });
  });

  it("should handle empty arrayCategories", async () => {
    const arrayCategories: string[] = [];
    const arrayLabelsTranslations = { arrayLabelsKey: "arrayLabelsValue" };
    const anyFlowTranslations = { anyFlowKey: "anyFlowValue" };
    vi.mocked(fetchTranslations)
      .mockResolvedValueOnce(arrayLabelsTranslations)
      .mockResolvedValueOnce(anyFlowTranslations);

    const result = await getPageTranslations(arrayCategories, "anyFlow");

    expect(fetchTranslations).toHaveBeenCalledTimes(2);
    expect(fetchTranslations).toHaveBeenCalledWith("arrayLabels");
    expect(fetchTranslations).toHaveBeenCalledWith("anyFlow");
    expect(result).toEqual({
      arrayLabelsKey: "arrayLabelsValue",
      anyFlowKey: "anyFlowValue",
    });
  });
});
