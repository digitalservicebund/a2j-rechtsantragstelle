import { fetchStreetnamesForZipcode } from "~/services/gerichtsfinder/openPLZ";

const fetchSpy = vi.spyOn(global, "fetch");

describe("OpenPLZ helpers", () => {
  describe("fetchStreetnamesForZipcode", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should send a request to the openPLZ API", async () => {
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
      } as Response);
      expect(await fetchStreetnamesForZipcode("12345")).toEqual([
        { name: "Coolstraße" },
        { name: "Geilestraße" },
      ]);
    });
  });
});
