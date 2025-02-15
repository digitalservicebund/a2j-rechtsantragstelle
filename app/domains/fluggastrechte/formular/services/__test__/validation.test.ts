import { z } from "zod";
import {
  validateAnotherFlightPage,
  validateDepartureAfterArrival,
  validateCancelFlightReplacementPage,
  validateReplacementConnectionPage,
  validateSameFlightPage,
} from "../validation";

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
        direktAnkunftsZeit: "10:00",
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

    it("should return success false given a departure date time equal arrival", () => {
      const result = validator.safeParse({
        direktAbflugsDatum: "01.01.2024",
        direktAbflugsZeit: "14:00",
        direktAnkunftsDatum: "01.01.2024",
        direktAnkunftsZeit: "14:00",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("validateSameFlightPage", () => {
    const baseSchema = z.object({
      direktAnkunftsDatum: z.string(),
      direktAnkunftsZeit: z.string(),
      tatsaechlicherAnkunftsDatum: z.string(),
      tatsaechlicherAnkunftsZeit: z.string(),
    });

    const validatorSameFlightPage = validateSameFlightPage(baseSchema);

    it("should return success false given undefined values", () => {
      const result = validatorSameFlightPage.safeParse({
        direktAnkunftsDatum: undefined,
        direktAnkunftsZeit: undefined,
        tatsaechlicherAnkunftsDatum: undefined,
        tatsaechlicherAnkunftsZeit: undefined,
      });

      expect(result.success).toBe(false);
    });

    it("should return success false given an original arrival time after the arrival", () => {
      const result = validatorSameFlightPage.safeParse({
        direktAnkunftsDatum: "01.01.2024",
        direktAnkunftsZeit: "14:00",
        tatsaechlicherAnkunftsDatum: "01.01.2024",
        tatsaechlicherAnkunftsZeit: "11:00",
      });

      expect(result.success).toBe(false);
    });

    it("should return success false given an original arrival date after the arrival", () => {
      const result = validatorSameFlightPage.safeParse({
        direktAnkunftsDatum: "02.01.2024",
        direktAnkunftsZeit: "14:00",
        tatsaechlicherAnkunftsDatum: "01.01.2024",
        tatsaechlicherAnkunftsZeit: "15:00",
      });

      expect(result.success).toBe(false);
    });

    it("should return success false given an original arrival date before three hours after the arrival", () => {
      const result = validatorSameFlightPage.safeParse({
        direktAnkunftsDatum: "02.01.2024",
        direktAnkunftsZeit: "14:00",
        tatsaechlicherAnkunftsDatum: "02.01.2024",
        tatsaechlicherAnkunftsZeit: "15:00",
      });

      expect(result.success).toBe(false);
    });

    it("should return success true given an original arrival date after three hours after the arrival", () => {
      const result = validatorSameFlightPage.safeParse({
        direktAnkunftsDatum: "02.01.2024",
        direktAnkunftsZeit: "14:00",
        tatsaechlicherAnkunftsDatum: "02.01.2024",
        tatsaechlicherAnkunftsZeit: "19:01",
      });

      expect(result.success).toBe(true);
    });
  });

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

  describe("validateCancelFlightReplacementPage", () => {
    const baseSchema = z.object({
      annullierungErsatzverbindungAbflugsDatum: z.string().optional(),
      annullierungErsatzverbindungAbflugsZeit: z.string().optional(),
      annullierungErsatzverbindungAnkunftsDatum: z.string().optional(),
      annullierungErsatzverbindungAnkunftsZeit: z.string().optional(),
    });

    const validatorCancelFlightReplacementPage =
      validateCancelFlightReplacementPage(baseSchema);

    it("should return success true given undefined values", () => {
      const result = validatorCancelFlightReplacementPage.safeParse({
        annullierungErsatzverbindungAbflugsDatum: undefined,
        annullierungErsatzverbindungAbflugsZeit: undefined,
        annullierungErsatzverbindungAnkunftsDatum: undefined,
        annullierungErsatzverbindungAnkunftsZeit: undefined,
      });

      expect(result.success).toBe(true);
    });

    it("should return success true given empty values", () => {
      const result = validatorCancelFlightReplacementPage.safeParse({
        annullierungErsatzverbindungAbflugsDatum: "",
        annullierungErsatzverbindungAbflugsZeit: "",
        annullierungErsatzverbindungAnkunftsDatum: "",
        annullierungErsatzverbindungAnkunftsZeit: "",
      });

      expect(result.success).toBe(true);
    });

    it("should return success true given an original departure time after the arrival", () => {
      const result = validatorCancelFlightReplacementPage.safeParse({
        annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
        annullierungErsatzverbindungAbflugsZeit: "14:00",
        annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
        annullierungErsatzverbindungAnkunftsZeit: "11:00",
      });

      expect(result.success).toBe(true);
    });

    it("should return success false and path error for annullierungErsatzverbindungAbflugsDatum when annullierungErsatzverbindungAbflugsDatum is undefined and annullierungErsatzverbindungAbflugsZeit is defined", () => {
      const result = validatorCancelFlightReplacementPage.safeParse({
        annullierungErsatzverbindungAbflugsDatum: undefined,
        annullierungErsatzverbindungAbflugsZeit: "14:00",
        annullierungErsatzverbindungAnkunftsDatum: undefined,
        annullierungErsatzverbindungAnkunftsZeit: undefined,
      });

      expect(result.success).toBe(false);
      expect(result.error?.errors[0].path).toContain(
        "annullierungErsatzverbindungAbflugsDatum",
      );
    });

    it("should return success false and path error for annullierungErsatzverbindungAbflugsZeit when annullierungErsatzverbindungAbflugsZeit is undefined and annullierungErsatzverbindungAbflugsDatum is defined", () => {
      const result = validatorCancelFlightReplacementPage.safeParse({
        annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
        annullierungErsatzverbindungAbflugsZeit: undefined,
        annullierungErsatzverbindungAnkunftsDatum: undefined,
        annullierungErsatzverbindungAnkunftsZeit: undefined,
      });

      expect(result.success).toBe(false);
      expect(result.error?.errors[0].path).toContain(
        "annullierungErsatzverbindungAbflugsZeit",
      );
    });

    it("should return success false and path error for annullierungErsatzverbindungAnkunftsDatum when annullierungErsatzverbindungAnkunftsDatum is undefined and annullierungErsatzverbindungAnkunftsZeit is defined", () => {
      const result = validatorCancelFlightReplacementPage.safeParse({
        annullierungErsatzverbindungAbflugsDatum: undefined,
        annullierungErsatzverbindungAbflugsZeit: undefined,
        annullierungErsatzverbindungAnkunftsDatum: undefined,
        annullierungErsatzverbindungAnkunftsZeit: "14:00",
      });

      expect(result.success).toBe(false);
      expect(result.error?.errors[0].path).toContain(
        "annullierungErsatzverbindungAnkunftsDatum",
      );
    });

    it("should return success false and path error for annullierungErsatzverbindungAnkunftsZeit when annullierungErsatzverbindungAnkunftsZeit is undefined and annullierungErsatzverbindungAnkunftsDatum is defined", () => {
      const result = validatorCancelFlightReplacementPage.safeParse({
        annullierungErsatzverbindungAbflugsDatum: undefined,
        annullierungErsatzverbindungAbflugsZeit: undefined,
        annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
        annullierungErsatzverbindungAnkunftsZeit: undefined,
      });

      expect(result.success).toBe(false);
      expect(result.error?.errors[0].path).toContain(
        "annullierungErsatzverbindungAnkunftsZeit",
      );
    });
  });
});
