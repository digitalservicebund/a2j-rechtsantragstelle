import { describe, it, expect } from "vitest";
import { createArrayEditUrl } from "../arrayFieldProcessing";

describe("createArrayEditUrl", () => {
  describe("Beratungshilfe flows", () => {
    it("should handle bankkonten arrays", () => {
      const result = createArrayEditUrl(
        "bankkonten[0].kontostand",
        "/beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten/bankkonto/daten",
      );
      expect(result).toBe(
        "/beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten/uebersicht",
      );
    });

    it("should handle wertsachen field mapping", () => {
      const result = createArrayEditUrl(
        "wertsachen[0].art",
        "/beratungshilfe/antrag/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstand/daten",
      );
      expect(result).toBe(
        "/beratungshilfe/antrag/finanzielle-angaben/eigentum/wertgegenstaende/uebersicht",
      );
    });

    it("should handle unterhaltszahlungen contains matching", () => {
      const result = createArrayEditUrl(
        "unterhaltszahlungen[0].firstName",
        "/beratungshilfe/antrag/finanzielle-angaben/andere-unterhaltszahlungen/person/daten",
      );
      expect(result).toBe(
        "/beratungshilfe/antrag/finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
      );
    });
  });

  it("should return original URL for non-array fields", () => {
    const originalUrl = "/some/regular/field/url";
    const result = createArrayEditUrl("regularField", originalUrl);
    expect(result).toBe(originalUrl);
  });

  it("should handle any properly structured array URL", () => {
    const result = createArrayEditUrl(
      "someArray[0].field",
      "/beratungshilfe/antrag/some-section/collection-name/item-type/action",
    );
    expect(result).toBe(
      "/beratungshilfe/antrag/some-section/collection-name/uebersicht",
    );
  });
});
