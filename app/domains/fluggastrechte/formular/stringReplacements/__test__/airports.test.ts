import { getAirportNameByIataCode } from "../../../services/airports/getAirportNameByIataCode";
import { getEndAirportName, getStartAirportName } from "../airports";

vi.mock("../../../services/airports/getAirportNameByIataCode");
vi.mock("../../../services/airports/getAirportByIataCode");

describe("airports", () => {
  describe("getStartAirportName", () => {
    it("should return the correct name of the airport", () => {
      vi.mocked(getAirportNameByIataCode).mockReturnValue(
        "Berlin Brandenburg Flughafen (BER)",
      );
      const actual = getStartAirportName({ startAirport: "BER" });
      expect(actual).toStrictEqual({
        startAirport: "Berlin Brandenburg Flughafen (BER)",
      });
    });

    it("should return empty when it does not have airport as parameter", () => {
      vi.mocked(getAirportNameByIataCode).mockReturnValueOnce("");
      const actual = getStartAirportName({});
      expect(actual).toStrictEqual({});
    });
  });

  describe("getEndAirportName", () => {
    it("should return the correct name of the airport", () => {
      vi.mocked(getAirportNameByIataCode).mockReturnValue(
        "Berlin Brandenburg Flughafen (BER)",
      );
      const actual = getEndAirportName({ endAirport: "BER" });
      expect(actual).toStrictEqual({
        endAirport: "Berlin Brandenburg Flughafen (BER)",
      });
    });

    it("should return empty when it does not have airport as parameter", () => {
      vi.mocked(getAirportNameByIataCode).mockReturnValue("");
      const actual = getEndAirportName({});
      expect(actual).toStrictEqual({});
    });
  });
});
