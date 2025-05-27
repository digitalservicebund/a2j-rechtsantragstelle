/* eslint-disable sonarjs/no-nested-functions */
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
        headers: {
          get(_header) {
            return "1";
          },
        },
      } as Response);
      expect(await fetchStreetnamesForZipcode("12345")).toEqual([
        { name: "Coolstraße" },
        { name: "Geilestraße" },
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
        } as Response);
      });
      const result = await fetchStreetnamesForZipcode("12345");
      expect(fetchSpy).toHaveBeenCalledTimes(3);
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockOpenPLZResponse);
    });
  });
});
