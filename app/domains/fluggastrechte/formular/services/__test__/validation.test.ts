import { z } from "zod";
import { validateDepartureAfterArrival } from "../validation";

describe("validation", () => {
  describe("validateDepartureAfterArrival", () => {
    const baseSchema = z.object({
      direktAbflugsDatum: z.string(),
      direktAbflugsZeit: z.string(),
      direktAnkunftsDatum: z.string(),
      direktAnkunftsZeit: z.string(),
    });

    const validator = validateDepartureAfterArrival(baseSchema);

    it("should return success false given undefined values", () => {
      const result = validator.safeParse({
        direktAbflugsDatum: undefined,
        direktAbflugsZeit: undefined,
        direktAnkunftsDatum: undefined,
        direktAnkunftsZeit: undefined,
      });

      expect(result.success).toBe(false);
    });

    it("should return success false given a departure time after the arrival", () => {
      const result = validator.safeParse({
        direktAbflugsDatum: "01.01.2024",
        direktAbflugsZeit: "14:00",
        direktAnkunftsDatum: "01.01.2024",
        direktAnkunftsZeit: "11:00",
      });

      expect(result.success).toBe(false);
    });

    it("should return success false given a departure date after the arrival", () => {
      const result = validator.safeParse({
        direktAbflugsDatum: "02.01.2024",
        direktAbflugsZeit: "14:00",
        direktAnkunftsDatum: "01.01.2024",
        direktAnkunftsZeit: "15:00",
      });

      expect(result.success).toBe(false);
    });

    it("should return success true given a departure date before the arrival", () => {
      const result = validator.safeParse({
        direktAbflugsDatum: "01.01.2024",
        direktAbflugsZeit: "14:00",
        direktAnkunftsDatum: "02.01.2024",
        direktAnkunftsZeit: "15:00",
      });

      expect(result.success).toBe(true);
    });

    it("should return success true given a departure time before the arrival", () => {
      const result = validator.safeParse({
        direktAbflugsDatum: "01.01.2024",
        direktAbflugsZeit: "14:00",
        direktAnkunftsDatum: "01.01.2024",
        direktAnkunftsZeit: "15:00",
      });

      expect(result.success).toBe(true);
    });
  });
});
