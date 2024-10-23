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

  describe("isDestinationGermanAirportsAndIsNotEligibleToClaim", () => {
    it("should return false given both non german airports", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "AMS",
        endAirport: "CDG",
        fluggesellschaft: "DL",
      };

      const actual = guards.isDestinationGermanAirportsAndIsNotEligibleToClaim({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given a start german airport", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "DRS",
        endAirport: "DRS",
        fluggesellschaft: "DL",
      };

      const actual = guards.isDestinationGermanAirportsAndIsNotEligibleToClaim({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return false given eu airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "AMS",
        endAirport: "DRS",
        fluggesellschaft: "LH",
      };

      const actual = guards.isDestinationGermanAirportsAndIsNotEligibleToClaim({
        context,
      });

      expect(actual).toBe(false);
    });

    it("should return true given an end german airport, a non start german airport and non eu airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "AMS",
        endAirport: "DRS",
        fluggesellschaft: "DL",
      };

      const actual = guards.isDestinationGermanAirportsAndIsNotEligibleToClaim({
        context,
      });

      expect(actual).toBe(true);
    });
  });

  describe("isDestinationGermanAirportsAndFluggesellschaftSonstiges", () => {
    it("should return false given both non german airports", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "AMS",
        endAirport: "CDG",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isDestinationGermanAirportsAndFluggesellschaftSonstiges({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return false given a start german airport", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "DRS",
        endAirport: "DRS",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isDestinationGermanAirportsAndFluggesellschaftSonstiges({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return false given non sonstiges airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "AMS",
        endAirport: "DRS",
        fluggesellschaft: "LH",
      };

      const actual =
        guards.isDestinationGermanAirportsAndFluggesellschaftSonstiges({
          context,
        });

      expect(actual).toBe(false);
    });

    it("should return true given an end german airport, a non start german airport and sonstiges airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "AMS",
        endAirport: "DRS",
        fluggesellschaft: "sonstiges",
      };

      const actual =
        guards.isDestinationGermanAirportsAndFluggesellschaftSonstiges({
          context,
        });

      expect(actual).toBe(true);
    });

    describe("isErfolgAnalog", () => {
      describe("gericht as yes", () => {
        it("should return false given gericht as yes", () => {
          const context: FluggastrechtVorabcheckContext = {
            startAirport: "AMS",
            endAirport: "DRS",
            fluggesellschaft: "LH",
            gericht: "yes",
          };

          const actual = guards.isErfolgAnalog({
            context,
          });

          expect(actual).toBe(false);
        });
      });

      describe("only german destination", () => {
        it("should return true given a destination airport without partner court and eu airline", () => {
          const context: FluggastrechtVorabcheckContext = {
            startAirport: "AMS",
            endAirport: "DRS",
            fluggesellschaft: "LH",
            gericht: "no",
          };

          const actual = guards.isErfolgAnalog({
            context,
          });

          expect(actual).toBe(true);
        });

        it("should return false given a destination airport without partner court and non eu airline", () => {
          const context: FluggastrechtVorabcheckContext = {
            startAirport: "AMS",
            endAirport: "DRS",
            fluggesellschaft: "DL",
            gericht: "no",
          };

          const actual = guards.isErfolgAnalog({
            context,
          });

          expect(actual).toBe(false);
        });

        it("should return false given a destination airport without partner court and sonstiges airline ", () => {
          const context: FluggastrechtVorabcheckContext = {
            startAirport: "AMS",
            endAirport: "DRS",
            fluggesellschaft: "sonstiges",
            gericht: "no",
          };

          const actual = guards.isErfolgAnalog({
            context,
          });

          expect(actual).toBe(false);
        });

        it("should return false given a destination airport with partner court and eu airline", () => {
          const context: FluggastrechtVorabcheckContext = {
            startAirport: "AMS",
            endAirport: "BER",
            fluggesellschaft: "LH",
            gericht: "no",
          };

          const actual = guards.isErfolgAnalog({
            context,
          });

          expect(actual).toBe(false);
        });

        it("should return false given a destination airport with partner court and non eu airline", () => {
          const context: FluggastrechtVorabcheckContext = {
            startAirport: "AMS",
            endAirport: "BER",
            fluggesellschaft: "DL",
            gericht: "no",
          };

          const actual = guards.isErfolgAnalog({
            context,
          });

          expect(actual).toBe(false);
        });

        it("should return true given a destination airport with partner court and sonstiges airline", () => {
          const context: FluggastrechtVorabcheckContext = {
            startAirport: "AMS",
            endAirport: "BER",
            fluggesellschaft: "sonstiges",
            gericht: "no",
          };

          const actual = guards.isErfolgAnalog({
            context,
          });

          expect(actual).toBe(true);
        });
      });

      describe("german departure without partner court", () => {
        it("should return true given a departure and destination without partner court with eu airline", () => {
          const context: FluggastrechtVorabcheckContext = {
            startAirport: "DRS",
            endAirport: "ERF",
            fluggesellschaft: "LH",
            gericht: "no",
          };

          const actual = guards.isErfolgAnalog({
            context,
          });

          expect(actual).toBe(true);
        });

        it("should return true given a departure and destination without partner court with no eu airline", () => {
          const context: FluggastrechtVorabcheckContext = {
            startAirport: "DRS",
            endAirport: "ERF",
            fluggesellschaft: "DL",
            gericht: "no",
          };

          const actual = guards.isErfolgAnalog({
            context,
          });

          expect(actual).toBe(true);
        });

        it("should return true given a departure and destination without partner court with sonstiges airline", () => {
          const context: FluggastrechtVorabcheckContext = {
            startAirport: "DRS",
            endAirport: "ERF",
            fluggesellschaft: "sonstiges",
            gericht: "no",
          };

          const actual = guards.isErfolgAnalog({
            context,
          });

          expect(actual).toBe(true);
        });
      });

      describe("german departure with partner court either in departure or departure", () => {
        it("should return true given a departure with partner court", () => {
          const context: FluggastrechtVorabcheckContext = {
            startAirport: "BER",
            endAirport: "ERF",
            fluggesellschaft: "sonstiges",
            gericht: "no",
          };

          const actual = guards.isErfolgAnalog({
            context,
          });

          expect(actual).toBe(true);
        });

        it("should return false given a departure with partner court and eu airline", () => {
          const context: FluggastrechtVorabcheckContext = {
            startAirport: "BER",
            endAirport: "ERF",
            fluggesellschaft: "LH",
            gericht: "no",
          };

          const actual = guards.isErfolgAnalog({
            context,
          });

          expect(actual).toBe(false);
        });

        it("should return false given a departure with partner court and non eu airline", () => {
          const context: FluggastrechtVorabcheckContext = {
            startAirport: "BER",
            endAirport: "ERF",
            fluggesellschaft: "DL",
            gericht: "no",
          };

          const actual = guards.isErfolgAnalog({
            context,
          });

          expect(actual).toBe(false);
        });

        it("should return true given a destination with partner court", () => {
          const context: FluggastrechtVorabcheckContext = {
            startAirport: "ERF",
            endAirport: "BER",
            fluggesellschaft: "sonstiges",
            gericht: "no",
          };

          const actual = guards.isErfolgAnalog({
            context,
          });

          expect(actual).toBe(true);
        });

        it("should return false given a destination with partner court and eu airline", () => {
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

        it("should return false given a destination with partner court and non eu airline", () => {
          const context: FluggastrechtVorabcheckContext = {
            startAirport: "ERF",
            endAirport: "BER",
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
  });
});
