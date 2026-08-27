import { parseField } from "~/services/summary/fieldParsingUtils";
import { getParentIndexSummaryOverride } from "../summaryFieldOverride";

describe("getParentIndexSummaryOverride", () => {
  it("returns undefined for fields that aren't a parent-index field", () => {
    const fieldInfo = parseField("kinder[0].vorname");
    expect(
      getParentIndexSummaryOverride(fieldInfo, "Anna", {
        kinder: [{ vorname: "Anna" }],
      }),
    ).toBeUndefined();
  });

  it("resolves the parent's name from a kinder-tree parentKindIndex", () => {
    const userData = {
      kinder: [
        { vorname: "Anna", isAlive: "no", hatteKinder: "yes" },
        { vorname: "Ben", isAlive: "yes", hatteKinder: "yes" },
        {
          vorname: "Enkel",
          isAlive: "yes",
          parentKindIndex: "0",
        },
      ],
    };
    const fieldInfo = parseField("kinder[2].kinder[0].parentKindIndex");

    const result = getParentIndexSummaryOverride(fieldInfo, "0", userData);

    expect(result).toEqual({ question: "Kind von", answer: "Anna" });
  });

  it("resolves 'both' for a parentElternteilIndex of both parents", () => {
    const userData = {
      elternteile: [
        { vorname: "Maria", isAlive: "no" },
        { vorname: "Klaus", isAlive: "no" },
      ],
    };
    const fieldInfo = parseField(
      "elternteile[0].kinder[0].parentElternteilIndex",
    );

    const result = getParentIndexSummaryOverride(fieldInfo, "both", userData);

    expect(result).toEqual({
      question: "Kind von",
      answer: "Beide Elternteile",
    });
  });

  it("falls back to 'Keine Angabe' when the chosen parent can't be resolved", () => {
    const userData = { kinder: [] };
    const fieldInfo = parseField("kinder[0].kinder[0].parentKindIndex");

    const result = getParentIndexSummaryOverride(fieldInfo, "0", userData);

    expect(result).toEqual({ question: "Kind von", answer: "Keine Angabe" });
  });
});
