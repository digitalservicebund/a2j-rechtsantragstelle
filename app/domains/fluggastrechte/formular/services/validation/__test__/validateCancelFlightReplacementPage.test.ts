import { z } from "zod";
import { validateCancelFlightReplacementPage } from "../validateCancelFlightReplacementPage";

describe("validateCancelFlightReplacementPage", () => {
  const baseSchema = z.object({
    annullierungErsatzverbindungFlugnummer: z.string().optional(),
    annullierungErsatzverbindungAbflugsDatum: z.string().optional(),
    annullierungErsatzverbindungAbflugsZeit: z.string().optional(),
    annullierungErsatzverbindungAnkunftsDatum: z.string().optional(),
    annullierungErsatzverbindungAnkunftsZeit: z.string().optional(),
    ankuendigung: z.string().optional(),
    ersatzflugStartenZweiStunden: z.string().optional(),
    ersatzflugLandenVierStunden: z.string().optional(),
    direktAbflugsDatum: z.string().optional(),
    direktAbflugsZeit: z.string().optional(),
    direktAnkunftsDatum: z.string().optional(),
    direktAnkunftsZeit: z.string().optional(),
  });

  const validatorCancelFlightReplacementPage =
    validateCancelFlightReplacementPage(baseSchema);

  it("should return success true given undefined values", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      annullierungErsatzverbindungFlugnummer: undefined,
      annullierungErsatzverbindungAbflugsDatum: undefined,
      annullierungErsatzverbindungAbflugsZeit: undefined,
      annullierungErsatzverbindungAnkunftsDatum: undefined,
      annullierungErsatzverbindungAnkunftsZeit: undefined,
    });

    expect(result.success).toBe(true);
  });

  it("should return success true given empty values", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      annullierungErsatzverbindungFlugnummer: "",
      annullierungErsatzverbindungAbflugsDatum: "",
      annullierungErsatzverbindungAbflugsZeit: "",
      annullierungErsatzverbindungAnkunftsDatum: "",
      annullierungErsatzverbindungAnkunftsZeit: "",
    });

    expect(result.success).toBe(true);
  });

  it("should fail validation when only the departure time is provided", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      annullierungErsatzverbindungFlugnummer: undefined,
      annullierungErsatzverbindungAbflugsDatum: undefined,
      annullierungErsatzverbindungAbflugsZeit: "14:00",
      annullierungErsatzverbindungAnkunftsDatum: undefined,
      annullierungErsatzverbindungAnkunftsZeit: undefined,
    });

    expect(result.success).toBe(false);
    expect(result.error?.errors.length).toBe(4);
    expect(
      result.error?.errors.some((error) =>
        error.path.includes("annullierungErsatzverbindungAbflugsDatum"),
      ),
    ).toBe(true);
  });

  it("should fail validation when only the departure date is provided", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      annullierungErsatzverbindungFlugnummer: undefined,
      annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
      annullierungErsatzverbindungAbflugsZeit: undefined,
      annullierungErsatzverbindungAnkunftsDatum: undefined,
      annullierungErsatzverbindungAnkunftsZeit: undefined,
    });

    expect(result.success).toBe(false);
    expect(result.error?.errors.length).toBe(4);
    expect(
      result.error?.errors.some((error) =>
        error.path.includes("annullierungErsatzverbindungAbflugsZeit"),
      ),
    ).toBe(true);
  });

  it("should fail validation when only the arrival time is provided", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      annullierungErsatzverbindungFlugnummer: undefined,
      annullierungErsatzverbindungAbflugsDatum: undefined,
      annullierungErsatzverbindungAbflugsZeit: undefined,
      annullierungErsatzverbindungAnkunftsDatum: undefined,
      annullierungErsatzverbindungAnkunftsZeit: "14:00",
    });

    expect(result.success).toBe(false);
    expect(result.error?.errors.length).toBe(4);
    expect(
      result.error?.errors.some((error) =>
        error.path.includes("annullierungErsatzverbindungAnkunftsDatum"),
      ),
    ).toBe(true);
  });

  it("should fail validation when only the arrival date is provided", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      annullierungErsatzverbindungFlugnummer: undefined,
      annullierungErsatzverbindungAbflugsDatum: undefined,
      annullierungErsatzverbindungAbflugsZeit: undefined,
      annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
      annullierungErsatzverbindungAnkunftsZeit: undefined,
    });

    expect(result.success).toBe(false);
    expect(result.error?.errors.length).toBe(4);
    expect(
      result.error?.errors.some((error) =>
        error.path.includes("annullierungErsatzverbindungAnkunftsZeit"),
      ),
    ).toBe(true);
  });

  it("should fail validation when only the flight number is provided", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      annullierungErsatzverbindungFlugnummer: "AB1234",
      annullierungErsatzverbindungAbflugsDatum: undefined,
      annullierungErsatzverbindungAbflugsZeit: undefined,
      annullierungErsatzverbindungAnkunftsDatum: undefined,
      annullierungErsatzverbindungAnkunftsZeit: undefined,
    });

    expect(result.success).toBe(false);
    expect(result.error?.errors.length).toBe(4);
    expect(
      result.error?.errors.some((error) =>
        error.path.includes("annullierungErsatzverbindungAnkunftsZeit"),
      ),
    ).toBe(true);
  });

  it("should fail validation for all empty fields when at least two field is filled", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      annullierungErsatzverbindungFlugnummer: "AB1234",
      annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
      annullierungErsatzverbindungAbflugsZeit: undefined,
      annullierungErsatzverbindungAnkunftsDatum: undefined,
      annullierungErsatzverbindungAnkunftsZeit: undefined,
    });

    expect(result.success).toBe(false);
    expect(result.error?.errors).toHaveLength(3);
    expect(result.error?.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "fillAllOrNone",
          path: ["annullierungErsatzverbindungAbflugsZeit"],
        }),
        expect.objectContaining({
          message: "fillAllOrNone",
          path: ["annullierungErsatzverbindungAnkunftsDatum"],
        }),
        expect.objectContaining({
          message: "fillAllOrNone",
          path: ["annullierungErsatzverbindungAnkunftsZeit"],
        }),
      ]),
    );
  });

  it("should pass validation when all optional-required fields are provided", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      annullierungErsatzverbindungFlugnummer: "AB123",
      annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
      annullierungErsatzverbindungAbflugsZeit: "10:00",
      annullierungErsatzverbindungAnkunftsDatum: "02.01.2024",
      annullierungErsatzverbindungAnkunftsZeit: "12:00",
    });

    expect(result.success).toBe(true);
  });

  describe("validate when ankuendigung between7And13Days", () => {
    describe("check departure", () => {
      it("should fail validation given departure less than two hours from the original and ersatzflugStartenZweiStunden yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          annullierungErsatzverbindungFlugnummer: "AB123",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: "10:00",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: "18:00",
          ankuendigung: "between7And13Days",
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: "11:59",
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: "23:00",
          ersatzflugStartenZweiStunden: "yes",
          ersatzflugLandenVierStunden: "yes",
        });

        expect(result.success).toBe(false);
        expect(result.error?.errors).toHaveLength(2);
        expect(result.error?.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: "departureTwoHoursLateFromOriginalDeparture",
              path: ["annullierungErsatzverbindungAbflugsDatum"],
            }),
            expect.objectContaining({
              message: "departureTwoHoursLateFromOriginalDeparture",
              path: ["annullierungErsatzverbindungAbflugsZeit"],
            }),
          ]),
        );
      });
    });
  });
});
