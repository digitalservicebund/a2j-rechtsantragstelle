import { Result } from "true-myth";
import { calculateDistanceBetweenAirportsInKilometers } from "~/domains/fluggastrechte/services/airports/calculateDistanceBetweenAirports";
import { guards } from "~/domains/fluggastrechte/vorabcheck/guards";
import type { FluggastrechtVorabcheckUserData } from "~/domains/fluggastrechte/vorabcheck/userData";

vi.mock(
  "~/domains/fluggastrechte/services/airports/calculateDistanceBetweenAirports",
);
const mockedCalculateDistanceBetweenAirportsInKilometers = vi.mocked(
  calculateDistanceBetweenAirportsInKilometers,
);

describe("fluggastrechteGuard", () => {
  describe("areAirportsOutsideEU", () => {
    it("if the departure airport is in EU country, it should return false", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "BER",
        endAirport: "GRU",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(false);
    });

    it("if the destination airport is in EU country, it should return false", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "GRU",
        endAirport: "BER",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(false);
    });

    it("if the both airports are outside EU, it should return true", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "JFK",
        endAirport: "GRU",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(true);
    });

    it("if the departure airport does not exist, it should return false", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "BLABLA",
        endAirport: "BER",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(false);
    });

    it("if the destination airport does not exist, it should return false", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "BER",
        endAirport: "BLABLA",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(false);
    });

    it("if the departure airport is undefined, it should return false", () => {
      const context: FluggastrechtVorabcheckUserData = {
        endAirport: "BER",
      };

      const actual = guards.areAirportsOutsideEU({ context });

      expect(actual).toBe(false);
    });

    it("if the destination airport is undefined, it should return true", () => {
      const context: FluggastrechtVorabcheckUserData = {
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
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "BER",
      };

      mockedCalculateDistanceBetweenAirportsInKilometers.mockReturnValue(
        Result.err(""),
      );

      const actual = guards.isInvalidAirportDistance({ context });

      expect(actual).toBe(true);
    });

    it("in case is possible to calculate the airports, it should return false", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "BER",
      };

      mockedCalculateDistanceBetweenAirportsInKilometers.mockReturnValue(
        Result.ok(100),
      );

      const actual = guards.isInvalidAirportDistance({ context });

      expect(actual).toBe(false);
    });
  });

  describe("isNonGermanAirportsAndIsNotClaimableInEUWithOtherAirline", () => {
    it("should return false given a german departure airport", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "BER",
        endAirport: "CDG",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isNonGermanAirportsAndIsNotClaimableInEUWithOtherAirline({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return false given a german destination airport", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "CDG",
        endAirport: "BER",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isNonGermanAirportsAndIsNotClaimableInEUWithOtherAirline({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return false given a departure EU airport", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "CDG",
        endAirport: "JFK",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isNonGermanAirportsAndIsNotClaimableInEUWithOtherAirline({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return false given a non departure EU airport, destination EU airport and EU airline", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "JFK",
        endAirport: "CDG",
        fluggesellschaft: "LH",
      };

      const actual =
        guards.isNonGermanAirportsAndIsNotClaimableInEUWithOtherAirline({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return true given a non departure EU airport, destination EU airport and sonstiges airline", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "JFK",
        endAirport: "CDG",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isNonGermanAirportsAndIsNotClaimableInEUWithOtherAirline({
          context,
        });

      expect(actual).toBe(true);
    });
  });

  describe("isNonGermanAirportsAndIsNotClaimableInEU", () => {
    it("should return false given a german departure airport", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "BER",
        endAirport: "CDG",
        fluggesellschaft: "LH",
      };

      const actual = guards.isNonGermanAirportsAndIsNotClaimableInEU({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given a german destination airport", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "CDG",
        endAirport: "BER",
        fluggesellschaft: "LH",
      };

      const actual = guards.isNonGermanAirportsAndIsNotClaimableInEU({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given a departure EU airport", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "CDG",
        endAirport: "JFK",
        fluggesellschaft: "LH",
      };

      const actual = guards.isNonGermanAirportsAndIsNotClaimableInEU({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given a non departure EU airport, destination EU airport and EU airline", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "JFK",
        endAirport: "CDG",
        fluggesellschaft: "LH",
      };

      const actual = guards.isNonGermanAirportsAndIsNotClaimableInEU({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return true given a non departure EU airport, destination EU airport and non EU airline", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "JFK",
        endAirport: "CDG",
        fluggesellschaft: "DL",
      };

      const actual = guards.isNonGermanAirportsAndIsNotClaimableInEU({
        context,
      });

      expect(actual).toBe(true);
    });
  });

  describe("isErfolgEU", () => {
    it("should return false given gericht as yes", () => {
      const context: FluggastrechtVorabcheckUserData = {
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

    it("should return false given a german departure airport", () => {
      const context: FluggastrechtVorabcheckUserData = {
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

    it("should return false given a german destination airport", () => {
      const context: FluggastrechtVorabcheckUserData = {
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
      const context: FluggastrechtVorabcheckUserData = {
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

    it("should return false given an EU destination airport, non EU departure airport and airline ", () => {
      const context: FluggastrechtVorabcheckUserData = {
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

    it("should return true given an EU destination airport and airline, non EU departure airport ", () => {
      const context: FluggastrechtVorabcheckUserData = {
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

    it("should return false given non EU departure and destination airports", () => {
      const context: FluggastrechtVorabcheckUserData = {
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

  describe("isGermanEndAirportsAndIsNotClaimable", () => {
    it("should return false given a departure german airport", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "DRS",
        endAirport: "BER",
        fluggesellschaft: "DL",
      };

      const actual = guards.isGermanEndAirportsAndIsNotClaimable({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given a destination german airport, non eu departure and eu airline", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "JFK",
        endAirport: "BER",
        fluggesellschaft: "LH",
      };

      const actual = guards.isGermanEndAirportsAndIsNotClaimable({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given a destination german airport, non eu departure and sonstiges airline", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "JFK",
        endAirport: "BER",
        fluggesellschaft: "sonstiges",
      };

      const actual = guards.isGermanEndAirportsAndIsNotClaimable({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given a destination german airport, eu airline and non eu airline", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "AMS",
        endAirport: "DRS",
        fluggesellschaft: "DL",
      };

      const actual = guards.isGermanEndAirportsAndIsNotClaimable({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given a destination german airport, eu departure and eu airline", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "AMS",
        endAirport: "DRS",
        fluggesellschaft: "LH",
      };

      const actual = guards.isGermanEndAirportsAndIsNotClaimable({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given a destination german airport, eu departure and sonstiges airline", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "AMS",
        endAirport: "DRS",
        fluggesellschaft: "sonstiges",
      };

      const actual = guards.isGermanEndAirportsAndIsNotClaimable({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return true given a destination german airport, non eu departure and non eu airline", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "JFK",
        endAirport: "DRS",
        fluggesellschaft: "DL",
      };

      const actual = guards.isGermanEndAirportsAndIsNotClaimable({
        context,
      });

      expect(actual).toBe(true);
    });
  });

  describe("isGermanEndAirportsAndOtherAirline", () => {
    it("should return false given both non german airports", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "AMS",
        endAirport: "CDG",
        fluggesellschaft: "sonstiges",
      };

      const actual = guards.isGermanEndAirportsAndOtherAirline({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given a departure german airport", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "DRS",
        endAirport: "DRS",
        fluggesellschaft: "sonstiges",
      };

      const actual = guards.isGermanEndAirportsAndOtherAirline({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given an eu airline", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "AMS",
        endAirport: "DRS",
        fluggesellschaft: "LH",
      };

      const actual = guards.isGermanEndAirportsAndOtherAirline({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given a destination german airport, an eu departure airport and sonstiges airline", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "AMS",
        endAirport: "DRS",
        fluggesellschaft: "sonstiges",
      };

      const actual = guards.isGermanEndAirportsAndOtherAirline({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given a destination german airport, a non eu departure airport and an eu airline", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "JFK",
        endAirport: "DRS",
        fluggesellschaft: "LH",
      };

      const actual = guards.isGermanEndAirportsAndOtherAirline({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return true given a destination german airport, a non eu departure airport and sonstiges airline", () => {
      const context: FluggastrechtVorabcheckUserData = {
        startAirport: "JFK",
        endAirport: "DRS",
        fluggesellschaft: "sonstiges",
      };

      const actual = guards.isGermanEndAirportsAndOtherAirline({
        context,
      });

      expect(actual).toBe(true);
    });
  });
});
