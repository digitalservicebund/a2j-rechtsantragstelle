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

    it("if the both airports are outside EU, it should return true", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "JFK",
        endAirport: "GRU",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(true);
    });

    it("if the start airport does not exist, it should return false", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BLABLA",
        endAirport: "BER",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(false);
    });

    it("if the end airport does not exist, it should return false", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "BLABLA",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(false);
    });

    it("if the start airport is undefined, it should return false", () => {
      const context: FluggastrechtVorabcheckContext = {
        endAirport: "BER",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(false);
    });

    it("if the end airport is undefined, it should return true", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(false);
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

  describe("isNonGermanAirportsAndDestinationEUAndFluggesellschaftSonstiges", () => {
    it("should return false given a non exist end airport german", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "CDG",
        endAirport: "XXX",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isNonGermanAirportsAndDestinationEUAndFluggesellschaftSonstiges({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return false given a german start airport", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "CDG",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isNonGermanAirportsAndDestinationEUAndFluggesellschaftSonstiges({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return false given a german end airport", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "CDG",
        endAirport: "BER",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isNonGermanAirportsAndDestinationEUAndFluggesellschaftSonstiges({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return false given an end airport outside of EU", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "CDG",
        endAirport: "JFK",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isNonGermanAirportsAndDestinationEUAndFluggesellschaftSonstiges({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return false given non german start and end airport, end airport in EU, but non sonstiges airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "CDG",
        endAirport: "AMS",
        fluggesellschaft: "LH",
      };

      const actual =
        guards.isNonGermanAirportsAndDestinationEUAndFluggesellschaftSonstiges({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return true given non german start and end airport, end airport in EU and sonstiges airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "CDG",
        endAirport: "AMS",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isNonGermanAirportsAndDestinationEUAndFluggesellschaftSonstiges({
          context,
        });

      expect(actual).toBe(true);
    });
  });

  describe("isNonGermanAirportsAndDestinationEUAndFluggesellschaftNotEU", () => {
    it("should return false given a non exist german end airport", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "CDG",
        endAirport: "XXX",
        fluggesellschaft: "DL",
      };

      const actual =
        guards.isNonGermanAirportsAndDestinationEUAndFluggesellschaftNotEU({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return false given a german start airport", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "CDG",
        fluggesellschaft: "DL",
      };

      const actual =
        guards.isNonGermanAirportsAndDestinationEUAndFluggesellschaftNotEU({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return false given a german end airport", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "CDG",
        endAirport: "BER",
        fluggesellschaft: "DL",
      };

      const actual =
        guards.isNonGermanAirportsAndDestinationEUAndFluggesellschaftNotEU({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return false given an end airport outside of EU", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "CDG",
        endAirport: "JFK",
        fluggesellschaft: "DL",
      };

      const actual =
        guards.isNonGermanAirportsAndDestinationEUAndFluggesellschaftNotEU({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return false given non german start and end airport, end airport in EU, but EU airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "CDG",
        endAirport: "AMS",
        fluggesellschaft: "LH",
      };

      const actual =
        guards.isNonGermanAirportsAndDestinationEUAndFluggesellschaftNotEU({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return true given non german start and end airport, end airport in EU and non EU airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "CDG",
        endAirport: "AMS",
        fluggesellschaft: "DL",
      };

      const actual =
        guards.isNonGermanAirportsAndDestinationEUAndFluggesellschaftNotEU({
          context,
        });

      expect(actual).toBe(true);
    });
  });

  describe("isErfolgEU", () => {
    it("should return false given gericht as yes", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "CDG",
        endAirport: "AMS",
        fluggesellschaft: "LH",
        gericht: "yes",
      };

      const actual = guards.isErfolgEU({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given a german start airport", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "AMS",
        fluggesellschaft: "LH",
        gericht: "no",
      };

      const actual = guards.isErfolgEU({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given a german end airport", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "CDG",
        endAirport: "BER",
        fluggesellschaft: "LH",
        gericht: "no",
      };

      const actual = guards.isErfolgEU({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return true given an EU airports ", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "CDG",
        endAirport: "AMS",
        fluggesellschaft: "LH",
        gericht: "no",
      };

      const actual = guards.isErfolgEU({
        context,
      });

      expect(actual).toBe(true);
    });

    it("should return false given an EU end airport, non EU start airport and airline ", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "JFK",
        endAirport: "AMS",
        fluggesellschaft: "DL",
        gericht: "no",
      };

      const actual = guards.isErfolgEU({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return true given an EU end airport and airline, non EU start airport ", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "JFK",
        endAirport: "AMS",
        fluggesellschaft: "LH",
        gericht: "no",
      };

      const actual = guards.isErfolgEU({
        context,
      });

      expect(actual).toBe(true);
    });

    it("should return false given non EU start and end airports", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "JFK",
        endAirport: "GRU",
        fluggesellschaft: "LH",
        gericht: "no",
      };

      const actual = guards.isErfolgEU({
        context,
      });

      expect(actual).toBe(false);
    });
  });

  describe("isGermanAirportsAndHasNotPartnerCourtAndFluggesellschaftNotEU", () => {
    it("should return false given a non german start airport", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "CDG",
        endAirport: "FRA",
        fluggesellschaft: "DL",
      };

      const actual =
        guards.isGermanAirportsAndHasNotPartnerCourtAndFluggesellschaftNotEU({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return false given a non german end airport", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "CDG",
        fluggesellschaft: "DL",
      };

      const actual =
        guards.isGermanAirportsAndHasNotPartnerCourtAndFluggesellschaftNotEU({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return false given a start and end airport with partner court", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "FRA",
        fluggesellschaft: "DL",
      };

      const actual =
        guards.isGermanAirportsAndHasNotPartnerCourtAndFluggesellschaftNotEU({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return true given a start and end airport without partner court and airline non EU", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "DRS",
        endAirport: "DRS",
        fluggesellschaft: "DL",
      };

      const actual =
        guards.isGermanAirportsAndHasNotPartnerCourtAndFluggesellschaftNotEU({
          context,
        });

      expect(actual).toBe(true);
    });

    it("should return false given a start and end airport without partner court and airline in EU", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "DRS",
        endAirport: "DRS",
        fluggesellschaft: "LH",
      };

      const actual =
        guards.isGermanAirportsAndHasNotPartnerCourtAndFluggesellschaftNotEU({
          context,
        });

      expect(actual).toBe(false);
    });
  });

  describe("isGermanAirportsAndHasNotPartnerCourtAndFluggesellschaftSonstiges", () => {
    it("should return false given a non german start airport", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "CDG",
        endAirport: "FRA",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isGermanAirportsAndHasNotPartnerCourtAndFluggesellschaftSonstiges(
          {
            context,
          },
        );

      expect(actual).toBe(false);
    });

    it("should return false given a non german end airport", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "CDG",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isGermanAirportsAndHasNotPartnerCourtAndFluggesellschaftSonstiges(
          {
            context,
          },
        );

      expect(actual).toBe(false);
    });

    it("should return false given a start and end airport with partner court", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "FRA",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isGermanAirportsAndHasNotPartnerCourtAndFluggesellschaftSonstiges(
          {
            context,
          },
        );

      expect(actual).toBe(false);
    });

    it("should return true given a start and end airport without partner court and airline as sonstiges", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "DRS",
        endAirport: "DRS",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isGermanAirportsAndHasNotPartnerCourtAndFluggesellschaftSonstiges(
          {
            context,
          },
        );

      expect(actual).toBe(true);
    });

    it("should return false given a start and end airport without partner court and airline not sonstiges", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "DRS",
        endAirport: "DRS",
        fluggesellschaft: "LH",
      };

      const actual =
        guards.isGermanAirportsAndHasNotPartnerCourtAndFluggesellschaftSonstiges(
          {
            context,
          },
        );

      expect(actual).toBe(false);
    });
  });

  describe("isErfolgAnalog", () => {
    it("should return false given gericht as yes", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "ERF",
        endAirport: "DRS",
        fluggesellschaft: "LH",
        gericht: "yes",
      };

      const actual = guards.isErfolgAnalog({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return true given two airports without partner court and airline in EU ", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "ERF",
        endAirport: "DRS",
        fluggesellschaft: "LH",
        gericht: "no",
      };

      const actual = guards.isErfolgAnalog({
        context,
      });

      expect(actual).toBe(true);
    });

    it("should return false given a start airport with pilot court ", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "DRS",
        fluggesellschaft: "LH",
        gericht: "no",
      };

      const actual = guards.isErfolgAnalog({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given an end airport with pilot court ", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "ERF",
        endAirport: "BER",
        fluggesellschaft: "LH",
        gericht: "no",
      };

      const actual = guards.isErfolgAnalog({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given no EU airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "ERF",
        endAirport: "DRS",
        fluggesellschaft: "DL",
        gericht: "no",
      };

      const actual = guards.isErfolgAnalog({
        context,
      });

      expect(actual).toBe(false);
    });
  });
});
