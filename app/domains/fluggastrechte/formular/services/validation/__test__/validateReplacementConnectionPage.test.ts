import { z } from "zod";
import { validateReplacementConnectionPage } from "../validateReplacementConnectionPage";

describe("validateReplacementConnectionPage", () => {
  const baseSchema = z.object({
    direktAnkunftsDatum: z.string(),
    direktAnkunftsZeit: z.string(),
    andereErsatzverbindungAnkunftsDatum: z.string(),
    andereErsatzverbindungAnkunftsZeit: z.string(),
    bereich: z.string(),
  });

  const validatorReplacementConnectionPage =
    validateReplacementConnectionPage(baseSchema);

  it("should return success false given undefined values", () => {
    const result = validatorReplacementConnectionPage.safeParse({
      direktAnkunftsDatum: undefined,
      direktAnkunftsZeit: undefined,
      andereErsatzverbindungAnkunftsDatum: undefined,
      andereErsatzverbindungAnkunftsZeit: undefined,
      bereich: "verspaetet",
    });

    expect(result.success).toBe(false);
  });

  it("should return success false given an original arrival time after the arrival", () => {
    const result = validatorReplacementConnectionPage.safeParse({
      direktAnkunftsDatum: "01.01.2024",
      direktAnkunftsZeit: "14:00",
      andereErsatzverbindungAnkunftsDatum: "01.01.2024",
      andereErsatzverbindungAnkunftsZeit: "11:00",
      bereich: "verspaetet",
    });

    expect(result.success).toBe(false);
  });

  it("should return success false given an original arrival date after the arrival", () => {
    const result = validatorReplacementConnectionPage.safeParse({
      direktAnkunftsDatum: "02.01.2024",
      direktAnkunftsZeit: "14:00",
      andereErsatzverbindungAnkunftsDatum: "01.01.2024",
      andereErsatzverbindungAnkunftsZeit: "15:00",
      bereich: "verspaetet",
    });

    expect(result.success).toBe(false);
  });

  it("should return success false given an original arrival date before three hours after the arrival and bereich verspaetet", () => {
    const result = validatorReplacementConnectionPage.safeParse({
      direktAnkunftsDatum: "02.01.2024",
      direktAnkunftsZeit: "14:00",
      andereErsatzverbindungAnkunftsDatum: "02.01.2024",
      andereErsatzverbindungAnkunftsZeit: "15:00",
      bereich: "verspaetet",
    });

    expect(result.success).toBe(false);
  });

  it("should return success true given an original arrival date after three hours after the arrival and bereich verspaetet", () => {
    const result = validatorReplacementConnectionPage.safeParse({
      direktAnkunftsDatum: "02.01.2024",
      direktAnkunftsZeit: "14:00",
      andereErsatzverbindungAnkunftsDatum: "02.01.2024",
      andereErsatzverbindungAnkunftsZeit: "19:01",
      bereich: "verspaetet",
    });

    expect(result.success).toBe(true);
  });

  it("should return success true given an original arrival date before three hours after the arrival and bereich annullierung", () => {
    const result = validatorReplacementConnectionPage.safeParse({
      direktAnkunftsDatum: "02.01.2024",
      direktAnkunftsZeit: "14:00",
      andereErsatzverbindungAnkunftsDatum: "02.01.2024",
      andereErsatzverbindungAnkunftsZeit: "15:00",
      bereich: "annullierung",
    });

    expect(result.success).toBe(true);
  });

  it("should return success true given an original arrival date before three hours after the arrival and bereich nichtbefoerderung", () => {
    const result = validatorReplacementConnectionPage.safeParse({
      direktAnkunftsDatum: "02.01.2024",
      direktAnkunftsZeit: "14:00",
      andereErsatzverbindungAnkunftsDatum: "02.01.2024",
      andereErsatzverbindungAnkunftsZeit: "15:00",
      bereich: "nichtbefoerderung",
    });

    expect(result.success).toBe(true);
  });
});
