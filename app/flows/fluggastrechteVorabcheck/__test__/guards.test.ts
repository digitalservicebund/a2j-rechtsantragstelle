import { Result } from "true-myth";
import type { FluggastrechtVorabcheckContext } from "~/flows/fluggastrechteVorabcheck/context";
import { guards } from "~/flows/fluggastrechteVorabcheck/guards";
import { calculateDistanceBetweenAirportsInKilometers } from "~/services/airports/calculateDistanceBetweenAirports";

vi.mock("~/services/airports/calculateDistanceBetweenAirports");
const mockedCalculateDistanceBetweenAirportsInKilometers = vi.mocked(
  calculateDistanceBetweenAirportsInKilometers,
);

describe("fluggastrechteGuard", () => {
  describe("areAirportsOutsideEU", () => {
    it("if the start airport is in EU country, it should return false", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "GRU",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(false);
    });

    it("if the end airport is in EU country, it should return false", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "GRU",
        endAirport: "BER",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(false);
    });

    it("if the both airpots are outside EU, it should return true", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "JFK",
        endAirport: "GRU",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(true);
    });

    it("if the start airport does not exist, it should return true", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BLABLA",
        endAirport: "BER",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(true);
    });

    it("if the end airport does not exist, it should return true", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "BLABLA",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(true);
    });

    it("if the start airport is undefined, it should return true", () => {
      const context: FluggastrechtVorabcheckContext = {
        endAirport: "BER",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(true);
    });

    it("if the end airport is undefined, it should return true", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
      };

      const actual = guards.areAirportsOutsideEU({ context });

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

  describe("isNotEligibleFluggesellschaftInEU", () => {
    it("should return false when start airport is not in the EU, end airport is in EU and airline has office in EU", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "JFK",
        endAirport: "BER",
        fluggesellschaft: "LH",
      };

      const actual = guards.isNotEligibleFluggesellschaftInEU({ context });

      expect(actual).toBe(false);
    });

    it("should return true when start airport is not in the EU, end airport is in EU and airline has office outside EU", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "JFK",
        endAirport: "BER",
        fluggesellschaft: "U2",
      };

      const actual = guards.isNotEligibleFluggesellschaftInEU({ context });

      expect(actual).toBe(true);
    });

    it("should return true when start, end airport and airline office are outside EU", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "JFK",
        endAirport: "GRU",
        fluggesellschaft: "U2",
      };

      const actual = guards.isNotEligibleFluggesellschaftInEU({ context });

      expect(actual).toBe(true);
    });

    it("should return false when start, end airport and airline office are in EU", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "FRA",
        fluggesellschaft: "LH",
      };

      const actual = guards.isNotEligibleFluggesellschaftInEU({ context });

      expect(actual).toBe(false);
    });

    it("should return false when start airport is EU, end airport is not EU and airline office are outside EU", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "GRU",
        fluggesellschaft: "U2",
      };

      const actual = guards.isNotEligibleFluggesellschaftInEU({ context });

      expect(actual).toBe(false);
    });

    it("should return false when start airport is EU, end airport is not EU and airline office is in EU", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "GRU",
        fluggesellschaft: "LH",
      };

      const actual = guards.isNotEligibleFluggesellschaftInEU({ context });

      expect(actual).toBe(false);
    });

    it("should return false when start airport is EU, end airport is EU and airline office is outside EU", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "FRA",
        fluggesellschaft: "U2",
      };

      const actual = guards.isNotEligibleFluggesellschaftInEU({ context });

      expect(actual).toBe(false);
    });
  });

  describe("isStartAirportNotEUAndFluggesellschaftSonstiges", () => {
    it("returns true when start airport is outside EU and airline is 'sonstiges'", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "JFK",
        endAirport: "BER",
        fluggesellschaft: "sonstiges",
      };

      const actual = guards.isStartAirportNotEUAndFluggesellschaftSonstiges({
        context,
      });

      expect(actual).toBe(true);
    });

    it("returns false when start airport is in EU and airline is 'sonstiges'", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "JFK",
        fluggesellschaft: "sonstiges",
      };

      const actual = guards.isStartAirportNotEUAndFluggesellschaftSonstiges({
        context,
      });

      expect(actual).toBe(false);
    });

    it("returns false when start airport is in EU and airline is known", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "JFK",
        fluggesellschaft: "LH",
      };

      const actual = guards.isStartAirportNotEUAndFluggesellschaftSonstiges({
        context,
      });

      expect(actual).toBe(false);
    });
  });
});
