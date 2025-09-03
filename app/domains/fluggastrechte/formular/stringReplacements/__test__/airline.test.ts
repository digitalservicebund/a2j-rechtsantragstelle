import { getAirlineAddressFromDB, getAirlineName } from "../airline";

describe("airline", () => {
  describe("getAirlineName", () => {
    it("should return the airline name given an exist airline code", () => {
      const context = {
        fluggesellschaft: "LH",
      };

      const actual = getAirlineName(context);

      expect(actual).toStrictEqual({ airlineName: "Deutsche Lufthansa AG" });
    });

    it("should return not airline name given an exist non airline code", () => {
      const context = {
        fluggesellschaft: "XXX",
      };

      const actual = getAirlineName(context);

      expect(actual).toStrictEqual({});
    });

    it("should return empty data given undefined fluggesellschaft", () => {
      const context = {
        fluggesellschaft: undefined,
      };

      const actual = getAirlineName(context);

      expect(actual).toStrictEqual({});
    });
  });

  describe("getAirlineAddressFromDB", () => {
    it("should return the correct data when the airline exist", () => {
      const context = {
        fluggesellschaft: "LH",
      };

      const actual = getAirlineAddressFromDB(context);

      expect(actual).toStrictEqual({
        airlineCityDB: "50672",
        airlineCountryDB: "Deutschland",
        airlinePostalCodeDB: "Köln",
        airlineStreetAndNumberDB: "Venloer Straße 151 - 153",
      });
    });

    it("should return empty data given undefined fluggesellschaft", () => {
      const context = {
        fluggesellschaft: undefined,
      };

      const actual = getAirlineAddressFromDB(context);

      expect(actual).toStrictEqual({});
    });

    it("should return empty data given an exist non airline code", () => {
      const context = {
        fluggesellschaft: "XXX",
      };

      const actual = getAirlineAddressFromDB(context);

      expect(actual).toStrictEqual({});
    });
  });
});
