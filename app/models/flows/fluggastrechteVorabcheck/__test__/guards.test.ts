import { Result } from "true-myth";
import type { FluggastrechtVorabcheckContext } from "~/models/flows/fluggastrechteVorabcheck/context";
import { guards } from "~/models/flows/fluggastrechteVorabcheck/guards";
import { calculateDistanceBetweenAirportsInKilometers } from "~/services/airports/calculateDistanceBetweenAirports";

vi.mock("~/services/airports/calculateDistanceBetweenAirports");
const mockedCalculateDistanceBetweenAirportsInKilometers = vi.mocked(
  calculateDistanceBetweenAirportsInKilometers,
);

describe("fluggastrechteGuard", () => {
  describe("isAirportOutsideEU", () => {
    it("if the start airport is in EU country, it should return false", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "GRU",
      };

      const actual = guards.isAirportOutsideEU({ context });

      expect(actual).toBe(false);
    });

    it("if the end airport is in EU country, it should return false", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "GRU",
        endAirport: "BER",
      };

      const actual = guards.isAirportOutsideEU({ context });

      expect(actual).toBe(false);
    });

    it("if the both airpots are outside EU, it should return true", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "JFK",
        endAirport: "GRU",
      };

      const actual = guards.isAirportOutsideEU({ context });

      expect(actual).toBe(true);
    });

    it("if the start airport does not exist, it should return true", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BLABLA",
        endAirport: "BER",
      };

      const actual = guards.isAirportOutsideEU({ context });

      expect(actual).toBe(true);
    });

    it("if the end airport does not exist, it should return true", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "BLABLA",
      };

      const actual = guards.isAirportOutsideEU({ context });

      expect(actual).toBe(true);
    });

    it("if the start airport is undefined, it should return true", () => {
      const context: FluggastrechtVorabcheckContext = {
        endAirport: "BER",
      };

      const actual = guards.isAirportOutsideEU({ context });

      expect(actual).toBe(true);
    });

    it("if the end airport is undefined, it should return true", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
      };

      const actual = guards.isAirportOutsideEU({ context });

      expect(actual).toBe(true);
    });
  });

  describe("isInvalidAirportDistance", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("in case is not possible to calculate the airports, it should return true", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
      };

      mockedCalculateDistanceBetweenAirportsInKilometers.mockReturnValue(
        Result.err(""),
      );

      const actual = guards.isInvalidAirportDistance({ context });

      expect(actual).toBe(true);
    });

    it("in case is possible to calculate the airports, it should return false", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
      };

      mockedCalculateDistanceBetweenAirportsInKilometers.mockReturnValue(
        Result.ok(100),
      );

      const actual = guards.isInvalidAirportDistance({ context });

      expect(actual).toBe(false);
    });
  });

  describe("isFluggesellschaftNotInEU", () => {
    it("should return true in case the airline is outside of EU", () => {
      const context: FluggastrechtVorabcheckContext = {
        fluggesellschaft: "DL",
      };

      const actual = guards.isFluggesellschaftNotInEU({ context });

      expect(actual).toBe(true);
    });

    it("should return false in case the airline is inside of EU", () => {
      const context: FluggastrechtVorabcheckContext = {
        fluggesellschaft: "LH",
      };

      const actual = guards.isFluggesellschaftNotInEU({ context });

      expect(actual).toBe(false);
    });

    it("should return true in case the airline is undefined", () => {
      const context: FluggastrechtVorabcheckContext = {
        fluggesellschaft: undefined,
      };

      const actual = guards.isFluggesellschaftNotInEU({ context });

      expect(actual).toBe(true);
    });
  });
});
