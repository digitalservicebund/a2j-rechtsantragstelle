import { z } from "zod";
import { airportSchema } from "~/services/validation/airport";
import { validateSameDepartureAndArrivalAirports } from "../validation";

describe("Vorabcheck - Multi Fields Validation", () => {
  describe("validateSameDepartureAndArrivalAirports", () => {
    const baseSchema = z.object({
      startAirport: airportSchema,
      endAirport: airportSchema,
    });

    const validator = validateSameDepartureAndArrivalAirports(baseSchema);

    it("should return success false when startAirport and endAirport are the same", () => {
      const result = validator.safeParse({
        startAirport: "JFK",
        endAirport: "JFK",
      });

      expect(result.success).toBe(false);
    });

    it("should return success true when startAirport and endAirport are different", () => {
      const result = validator.safeParse({
        startAirport: "JFK",
        endAirport: "LAX",
      });

      expect(result.success).toBe(true);
    });
  });
});
