import { FluggastrechtVorabcheckContext } from "../../context";
import { isErfolgAnalog } from "../isErfolgAnalog";

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

  describe("only german destination", () => {
    it("should return true given a destination airport without partner court and eu airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "AMS",
        endAirport: "DRS",
        fluggesellschaft: "LH",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(true);
    });

    it("should return false given a destination airport without partner court and non eu airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "JFK",
        endAirport: "DRS",
        fluggesellschaft: "DL",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(false);
    });

    it("should return true given a destination airport without partner court, start airport in EU and non eu airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "AMS",
        endAirport: "DRS",
        fluggesellschaft: "DL",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(true);
    });

    it("should return false given a start airport not in EU and destination airport without partner court and sonstiges airline ", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "JFK",
        endAirport: "DRS",
        fluggesellschaft: "sonstiges",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(false);
    });

    it("should return true given a start airport in EU and destination airport without partner court and sonstiges airline ", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "AMS",
        endAirport: "DRS",
        fluggesellschaft: "sonstiges",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(true);
    });

    it("should return false given a destination airport with partner court and eu airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "AMS",
        endAirport: "BER",
        fluggesellschaft: "LH",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(false);
    });

    it("should return false given a destination airport with partner court and non eu airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "AMS",
        endAirport: "BER",
        fluggesellschaft: "DL",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(false);
    });

    it("should return false given a destination airport with partner court and sonstiges airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "AMS",
        endAirport: "BER",
        fluggesellschaft: "sonstiges",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(false);
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

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(true);
    });

    it("should return true given a departure and destination without partner court with no eu airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "DRS",
        endAirport: "ERF",
        fluggesellschaft: "DL",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(true);
    });

    it("should return true given a departure and destination without partner court with sonstiges airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "DRS",
        endAirport: "ERF",
        fluggesellschaft: "sonstiges",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(true);
    });
  });

  describe("german departure airport with partner court either in departure or destination", () => {
    it("should return true given a departure with partner court and sonstiges airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "ERF",
        fluggesellschaft: "sonstiges",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(true);
    });

    it("should return false given a departure with partner court and eu airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "ERF",
        fluggesellschaft: "LH",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(false);
    });

    it("should return false given a departure with partner court and non eu airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "BER",
        endAirport: "ERF",
        fluggesellschaft: "DL",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(false);
    });

    it("should return true given a destination with partner court and sonstiges airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "ERF",
        endAirport: "BER",
        fluggesellschaft: "sonstiges",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(true);
    });

    it("should return false given a destination with partner court and eu airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "ERF",
        endAirport: "BER",
        fluggesellschaft: "LH",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(false);
    });

    it("should return false given a destination with partner court and non eu airline", () => {
      const context: FluggastrechtVorabcheckContext = {
        startAirport: "ERF",
        endAirport: "BER",
        fluggesellschaft: "DL",
        gericht: "no",
      };

      const actual = isErfolgAnalog(context);

      expect(actual).toBe(false);
    });
  });
});
