import {
  buildOpenPlzResultUrl,
  streetNamesForZipcode,
} from "~/services/gerichtsfinder/openPLZ";

describe("OpenPLZ helpers", () => {
  describe("fetchStreetnamesForZipcode", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should return empty array without input", async () => {
      expect(await streetNamesForZipcode()).toStrictEqual([]);
    });

    it("should return empty array for invalid postcodes", async () => {
      expect(await streetNamesForZipcode("asd")).toStrictEqual([]);
    });

    it("should filter by unique results", async () => {
      // 27499 (Insel Neuwerk) has only two entries
      expect(await streetNamesForZipcode("27499")).toEqual([
        { locality: "Hamburg", name: "Herrengarten" },
        { locality: "Hamburg", name: "Mittelweg" },
      ]);
    });
  });

  describe("buildOpenPlzResultUrl", () => {
    it("should replace umlauts with their phonetic equivalents", () => {
      expect(buildOpenPlzResultUrl("äöü", "123")).toBe("aeoeue/123");
    });

    it('should replace spaces with "_"', () => {
      expect(buildOpenPlzResultUrl("a b", "123")).toBe("a_b/123");
    });

    it("should trim the house number's ergänzung to retrieve only the first number", () => {
      expect(buildOpenPlzResultUrl("a", "123a")).toBe("a/123");
      expect(buildOpenPlzResultUrl("a", "123 1/2")).toBe("a/123");
      expect(buildOpenPlzResultUrl("a", "a123")).toBe("a/123");
    });
  });
});
