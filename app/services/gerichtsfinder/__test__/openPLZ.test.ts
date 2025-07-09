/* eslint-disable sonarjs/no-nested-functions */
import {
  buildOpenPlzResultUrl,
  fetchStreetnamesForZipcode,
} from "~/services/gerichtsfinder/openPLZ";

const fetchSpy = vi.fn();
global.fetch = fetchSpy;

describe("OpenPLZ helpers", () => {
  describe("fetchStreetnamesForZipcode", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should send a request to the openPLZ API", async () => {
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
        headers: { get: () => ({}) },
      });

      await fetchStreetnamesForZipcode("12345");
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://openplzapi.org/de/Streets?postalCode=12345&page=1&pageSize=50",
      );
    });

    it("should throw if the response is not ok", async () => {
      fetchSpy.mockResolvedValueOnce({ ok: false } as Response);
      await expect(
        async () => await fetchStreetnamesForZipcode("12345"),
      ).rejects.toThrow();
    });

    it("should filter by unique results", async () => {
      const mockOpenPLZResponse = [
        { name: "Coolstraße" },
        { name: "Coolstraße" },
        { name: "Geilestraße" },
      ];
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockOpenPLZResponse),
        headers: {
          get(_header) {
            return "1";
          },
        },
      } as Response);
      expect(await fetchStreetnamesForZipcode("12345")).toEqual([
        { label: "Coolstraße", value: "Coolstraße" },
        { label: "Geilestraße", value: "Geilestraße" },
      ]);
    });

    it("should fetch all paginated results", async () => {
      const mockOpenPLZResponse = [
        { name: "Straße 1" },
        { name: "Straße 2" },
        { name: "Straße 3" },
      ];
      fetchSpy.mockImplementation((url) => {
        const pageNum = parseInt(
          (url as string).match(/(?<=page=)\d/g)?.[0] ?? "",
        );
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockOpenPLZResponse.at(pageNum - 1)]),
          headers: {
            get(_header: string) {
              return "3";
            },
          },
        });
      });
      const result = await fetchStreetnamesForZipcode("12345");
      expect(fetchSpy).toHaveBeenCalledTimes(3);
      expect(result).toHaveLength(3);
      expect(result.map((r) => ({ name: r.label }))).toEqual(
        mockOpenPLZResponse,
      );
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
