import { z } from "zod";
import { getArrivalTimeDelayValidator } from "../getArrivalTimeDelayValidator";

describe("getArrivalTimeDelayValidator", () => {
  const baseSchema = z.object({
    tatsaechlicherAnkunftsDatum: z.string(),
    tatsaechlicherAnkunftsZeit: z.string(),
    direktAbflugsDatum: z.string(),
    direktAbflugsZeit: z.string(),
  });

  it("should return a validator", () => {
    const validator = getArrivalTimeDelayValidator(baseSchema);
    expect(validator).toBeDefined();
    expect(typeof validator.safeParse).toBe("function");
  });

  const validator = getArrivalTimeDelayValidator(baseSchema);

  it("should pass validation when arrival is at least 3 hours after departure", () => {
    const result = validator.safeParse({
      tatsaechlicherAnkunftsDatum: "01.01.2024",
      tatsaechlicherAnkunftsZeit: "14:00",
      direktAbflugsDatum: "01.01.2024",
      direktAbflugsZeit: "11:00",
    });

    expect(result.success).toBe(true);
  });

  it("should fail validation when arrival is less than 3 hours after departure", () => {
    const result = validator.safeParse({
      tatsaechlicherAnkunftsDatum: "01.01.2024",
      tatsaechlicherAnkunftsZeit: "12:00",
      direktAbflugsDatum: "01.01.2024",
      direktAbflugsZeit: "11:00",
    });

    expect(result.success).toBe(false);
  });

  it("should handle dates across different days", () => {
    const result = validator.safeParse({
      tatsaechlicherAnkunftsDatum: "02.01.2024",
      tatsaechlicherAnkunftsZeit: "00:30",
      direktAbflugsDatum: "01.01.2024",
      direktAbflugsZeit: "21:00",
    });

    expect(result.success).toBe(true);
  });

  it("should handle if date is before departure date", () => {
    const result = validator.safeParse({
      tatsaechlicherAnkunftsDatum: "01.01.2024",
      tatsaechlicherAnkunftsZeit: "00:30",
      direktAbflugsDatum: "02.01.2024",
      direktAbflugsZeit: "21:00",
    });

    expect(result.success).toBe(false);
  });
});
