import type { FluggastrechtVorabcheckContext } from "~/models/flows/fluggastrechte/context";
import { guards } from "~/models/flows/fluggastrechte/guards";
import { calculateDistanceBetweenAirportsInKilometers } from "~/util/calculateDistanceBetweenAirports";
import { Result } from "true-myth";

jest.mock("~/util/calculateDistanceBetweenAirports");

const mockedCalculateDistanceBetweenAirports =
  calculateDistanceBetweenAirportsInKilometers as jest.Mocked<
    typeof calculateDistanceBetweenAirportsInKilometers
  >;

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
      jest.clearAllMocks();
    });

    it("in case is not possible to calculate the airports, it should return true", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
      };

      (mockedCalculateDistanceBetweenAirports as jest.Mock).mockReturnValue(
        Result.err(""),
      );

      const actual = guards.isInvalidAirportDistance({ context });

      expect(actual).toBe(true);
    });

    it("in case is possible to calculate the airports, it should return false", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
      };

      (mockedCalculateDistanceBetweenAirports as jest.Mock).mockReturnValue(
        Result.ok(100),
      );

      const actual = guards.isInvalidAirportDistance({ context });

      expect(actual).toBe(false);
    });
  });
});
