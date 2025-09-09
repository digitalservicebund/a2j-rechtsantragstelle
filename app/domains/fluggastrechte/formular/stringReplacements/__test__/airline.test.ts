import { getAirlineAddress } from "../../services/getAirlineAddress";
import {
  getAirlineAddressFromDB,
  getAirlineAddressString,
  getAirlineName,
} from "../airline";

vi.mock("../../services/getAirlineAddress");

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
        airlineCityDB: "Köln",
        airlineCountryDB: "Deutschland",
        airlinePostalCodeDB: "50672",
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

  describe("getAirlineAddressString", () => {
    it("should return correct the airline address", () => {
      vi.mocked(getAirlineAddress).mockReturnValue({
        addressSource: "manual",
        streetAndNumber: "streetAndNumber",
        zipCode: "zipCode",
        city: "city",
        country: "country",
      });

      const actual = getAirlineAddressString({});

      expect(actual).toStrictEqual({
        isAirlineAddressFromDB: false,
        airlineCity: "city",
        airlineCountry: "country",
        airlinePostalCode: "zipCode",
        airlineStreetAndNumber: "streetAndNumber",
      });
    });
  });
});
