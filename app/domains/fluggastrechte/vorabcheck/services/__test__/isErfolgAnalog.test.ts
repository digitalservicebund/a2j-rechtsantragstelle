import { FluggastrechtVorabcheckContext } from "../../context";
import { isErfolgAnalog } from "../isErfolgAnalog";

const EU_AIRLINE = "LH";
const NON_EU_AIRLINE = "DL";
const SONSTIGES_AIRLINE = "sonstiges";

describe("isErfolgAnalog", () => {
  it("should return false given gericht as yes", () => {
    const context: FluggastrechtVorabcheckContext = {
      startAirport: "AMS",
      endAirport: "DRS",
      fluggesellschaft: "LH",
      gericht: "yes",
    };

    const actual = isErfolgAnalog(context);

    expect(actual).toBe(false);
  });

  describe("departure outside EU and only destination in DE", () => {
    describe("destination without partner court", () => {
      it("should return true given a departure outside EU and eu airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "JFK",
          endAirport: "DRS",
          fluggesellschaft: EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });

      it("should return false given a departure outside EU and non eu airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "JFK",
          endAirport: "DRS",
          fluggesellschaft: NON_EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });

      it("should return false given a departure outside EU and airline sonstiges", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "JFK",
          endAirport: "DRS",
          fluggesellschaft: SONSTIGES_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });
    });

    describe("destination with partner court", () => {
      it("should return false given a departure outside EU and eu airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "JFK",
          endAirport: "BER",
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
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "DRS",
          endAirport: "ERF",
          fluggesellschaft: EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });

      it("should return true given non eu airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "DRS",
          endAirport: "ERF",
          fluggesellschaft: NON_EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });

      it("should return true given sonstiges airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "DRS",
          endAirport: "ERF",
          fluggesellschaft: SONSTIGES_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });
    });

    describe("with partner court", () => {
      it("should return true departure airport with partner court and sonstiges airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "BER",
          endAirport: "ERF",
          fluggesellschaft: SONSTIGES_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });

      it("should return false departure airport with partner court and eu airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "BER",
          endAirport: "ERF",
          fluggesellschaft: EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });

      it("should return false departure airport with partner court and non eu airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "BER",
          endAirport: "ERF",
          fluggesellschaft: NON_EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });

      it("should return true destination airport with partner court and sonstiges airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "ERF",
          endAirport: "BER",
          fluggesellschaft: SONSTIGES_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });

      it("should return false destination airport with partner court and eu airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "ERF",
          endAirport: "BER",
          fluggesellschaft: EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });

      it("should return false destination airport with partner court and non eu airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "ERF",
          endAirport: "BER",
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
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "AMS",
          endAirport: "ERF",
          fluggesellschaft: EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });

      it("should return true given non eu airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "AMS",
          endAirport: "ERF",
          fluggesellschaft: NON_EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });

      it("should return true given non sonstiges airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "AMS",
          endAirport: "ERF",
          fluggesellschaft: SONSTIGES_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });
    });

    describe("destination with partner court", () => {
      it("should return false given eu airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "AMS",
          endAirport: "BER",
          fluggesellschaft: EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });

      it("should return false given non eu airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "AMS",
          endAirport: "BER",
          fluggesellschaft: NON_EU_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(false);
      });

      it("should return false given sonstiges airline", () => {
        const context: FluggastrechtVorabcheckContext = {
          startAirport: "AMS",
          endAirport: "BER",
          fluggesellschaft: SONSTIGES_AIRLINE,
          gericht: "no",
        };

        const actual = isErfolgAnalog(context);

        expect(actual).toBe(true);
      });
    });
  });
});
