import { type FluggastrechtVorabcheckUserData } from "../../userData";
import { isErfolgAnalog } from "../isErfolgAnalog";

const EU_AIRLINE = "LH";
const NON_EU_AIRLINE = "DL";
const SONSTIGES_AIRLINE = "sonstiges";
const PARTNER_COURT_AIRPORT = "MUC";
const NON_EU_AIRPORT = "JFK";
const NON_GERMAN_AIRPORT = "AMS";
const NON_PARTNER_COURT_AIRPORTS = ["ERF", "DRS"];

describe("isErfolgAnalog", () => {
  it("should return false given gericht as yes", () => {
    const context: FluggastrechtVorabcheckUserData = {
      startAirport: NON_GERMAN_AIRPORT,
      endAirport: NON_PARTNER_COURT_AIRPORTS[0],
      fluggesellschaft: "LH",
      gericht: "yes",
    };

    const actual = isErfolgAnalog(context);

    expect(actual).toBe(false);
  });

  describe("departure outside EU and only destination in DE", () => {
    describe("destination without partner court", () => {
      it("should return true given a departure outside EU and eu airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_EU_AIRPORT,
          endAirport: NON_PARTNER_COURT_AIRPORTS[0],
          fluggesellschaft: EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });

      it("should return false given a departure outside EU and non eu airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_EU_AIRPORT,
          endAirport: NON_PARTNER_COURT_AIRPORTS[1],
          fluggesellschaft: NON_EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });

      it("should return false given a departure outside EU and airline sonstiges", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_EU_AIRPORT,
          endAirport: NON_PARTNER_COURT_AIRPORTS[0],
          fluggesellschaft: SONSTIGES_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });
    });

    describe("destination with partner court", () => {
      it("should return false given a departure outside EU and eu airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_EU_AIRPORT,
          endAirport: PARTNER_COURT_AIRPORT,
          fluggesellschaft: EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });
    });
  });

  describe("only departure DE or both in DE", () => {
    describe("without partner court", () => {
      it("should return true given eu airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_PARTNER_COURT_AIRPORTS[0],
          endAirport: NON_PARTNER_COURT_AIRPORTS[1],
          fluggesellschaft: EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });

      it("should return true given non eu airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_PARTNER_COURT_AIRPORTS[0],
          endAirport: NON_PARTNER_COURT_AIRPORTS[1],
          fluggesellschaft: NON_EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });

      it("should return true given sonstiges airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_PARTNER_COURT_AIRPORTS[0],
          endAirport: NON_PARTNER_COURT_AIRPORTS[1],
          fluggesellschaft: SONSTIGES_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });
    });

    describe("with partner court", () => {
      it("should return true departure airport with partner court and sonstiges airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: PARTNER_COURT_AIRPORT,
          endAirport: NON_PARTNER_COURT_AIRPORTS[0],
          fluggesellschaft: SONSTIGES_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });

      it("should return false departure airport with partner court and eu airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: PARTNER_COURT_AIRPORT,
          endAirport: NON_PARTNER_COURT_AIRPORTS[1],
          fluggesellschaft: EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });

      it("should return false departure airport with partner court and non eu airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: PARTNER_COURT_AIRPORT,
          endAirport: NON_PARTNER_COURT_AIRPORTS[0],
          fluggesellschaft: NON_EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });

      it("should return true destination airport with partner court and sonstiges airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_PARTNER_COURT_AIRPORTS[0],
          endAirport: PARTNER_COURT_AIRPORT,
          fluggesellschaft: SONSTIGES_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });

      it("should return false destination airport with partner court and eu airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_PARTNER_COURT_AIRPORTS[0],
          endAirport: PARTNER_COURT_AIRPORT,
          fluggesellschaft: EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });

      it("should return false destination airport with partner court and non eu airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_PARTNER_COURT_AIRPORTS[0],
          endAirport: PARTNER_COURT_AIRPORT,
          fluggesellschaft: NON_EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });
    });
  });

  describe("departure in EU and destination in DE", () => {
    describe("destination without partner court", () => {
      it("should return true given eu airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_GERMAN_AIRPORT,
          endAirport: NON_PARTNER_COURT_AIRPORTS[0],
          fluggesellschaft: EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });

      it("should return true given non eu airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_GERMAN_AIRPORT,
          endAirport: NON_PARTNER_COURT_AIRPORTS[1],
          fluggesellschaft: NON_EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });

      it("should return true given non sonstiges airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_GERMAN_AIRPORT,
          endAirport: NON_PARTNER_COURT_AIRPORTS[0],
          fluggesellschaft: SONSTIGES_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });
    });

    describe("destination with partner court", () => {
      it("should return false given eu airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_GERMAN_AIRPORT,
          endAirport: PARTNER_COURT_AIRPORT,
          fluggesellschaft: EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });

      it("should return false given non eu airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_GERMAN_AIRPORT,
          endAirport: PARTNER_COURT_AIRPORT,
          fluggesellschaft: NON_EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });

      it("should return false given sonstiges airline", () => {
        const context: FluggastrechtVorabcheckUserData = {
          startAirport: NON_GERMAN_AIRPORT,
          endAirport: PARTNER_COURT_AIRPORT,
          fluggesellschaft: SONSTIGES_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });
    });
  });
});
