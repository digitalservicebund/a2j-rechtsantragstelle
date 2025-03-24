import { z } from "zod";
import { validateAnotherFlightPage } from "../validateAnotherFlightPage";

describe("validateAnotherFlightPage", () => {
  const baseSchema = z.object({
    direktAnkunftsDatum: z.string(),
    direktAnkunftsZeit: z.string(),
    ersatzFlugAnkunftsDatum: z.string(),
    ersatzFlugAnkunftsZeit: z.string(),
    bereich: z.string(),
  });

  const validatorAnotherPage = validateAnotherFlightPage(baseSchema);

  it("should return success false given undefined values", () => {
    const result = validatorAnotherPage.safeParse({
      direktAnkunftsDatum: undefined,
      direktAnkunftsZeit: undefined,
      ersatzFlugAnkunftsDatum: undefined,
      ersatzFlugAnkunftsZeit: undefined,
      bereich: "verspaetet",
    });

    expect(result.success).toBe(false);
  });

  it("should return success false given an original arrival time after the arrival", () => {
    const result = validatorAnotherPage.safeParse({
      direktAnkunftsDatum: "01.01.2024",
      direktAnkunftsZeit: "14:00",
      ersatzFlugAnkunftsDatum: "01.01.2024",
      ersatzFlugAnkunftsZeit: "11:00",
      bereich: "verspaetet",
    });

    expect(result.success).toBe(false);
  });

  it("should return success false given an original arrival date after the arrival", () => {
    const result = validatorAnotherPage.safeParse({
      direktAnkunftsDatum: "02.01.2024",
      direktAnkunftsZeit: "14:00",
      ersatzFlugAnkunftsDatum: "01.01.2024",
      ersatzFlugAnkunftsZeit: "15:00",
      bereich: "verspaetet",
    });

    expect(result.success).toBe(false);
  });

  it("should return success false given an original arrival date before three hours after the arrival and bereich verspaetet", () => {
    const result = validatorAnotherPage.safeParse({
      direktAnkunftsDatum: "02.01.2024",
      direktAnkunftsZeit: "14:00",
      ersatzFlugAnkunftsDatum: "02.01.2024",
      ersatzFlugAnkunftsZeit: "15:00",
      bereich: "verspaetet",
    });

    expect(result.success).toBe(false);
  });

  it("should return success true given an original arrival date after three hours after the arrival and bereich verspaetet", () => {
    const result = validatorAnotherPage.safeParse({
      direktAnkunftsDatum: "02.01.2024",
      direktAnkunftsZeit: "14:00",
      ersatzFlugAnkunftsDatum: "02.01.2024",
      ersatzFlugAnkunftsZeit: "19:01",
      bereich: "verspaetet",
    });

    expect(result.success).toBe(true);
  });

  it("should return success true given an original arrival date before three hours after the arrival and bereich annullierung", () => {
    const result = validatorAnotherPage.safeParse({
      direktAnkunftsDatum: "02.01.2024",
      direktAnkunftsZeit: "14:00",
      ersatzFlugAnkunftsDatum: "02.01.2024",
      ersatzFlugAnkunftsZeit: "15:00",
      bereich: "annullierung",
    });

    expect(result.success).toBe(true);
  });

  it("should return success true given an original arrival date before three hours after the arrival and bereich nichtbefoerderung", () => {
    const result = validatorAnotherPage.safeParse({
      direktAnkunftsDatum: "02.01.2024",
      direktAnkunftsZeit: "14:00",
      ersatzFlugAnkunftsDatum: "02.01.2024",
      ersatzFlugAnkunftsZeit: "15:00",
      bereich: "nichtbefoerderung",
    });

    expect(result.success).toBe(true);
  });
});
