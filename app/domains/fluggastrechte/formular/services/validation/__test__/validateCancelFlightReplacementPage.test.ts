import pick from "lodash/pick";
import { z } from "zod";
import { today, toGermanDateFormat } from "~/util/date";
import { fluggastrechteInputSchema } from "../../../userData";
import { validateCancelFlightReplacementPage } from "../validateCancelFlightReplacementPage";

describe("validateCancelFlightReplacementPage", () => {
  const baseSchema = z.object(
    pick(fluggastrechteInputSchema, [
      "annullierungErsatzverbindungFlugnummer",
      "annullierungErsatzverbindungAbflugsDatum",
      "annullierungErsatzverbindungAbflugsZeit",
      "annullierungErsatzverbindungAnkunftsDatum",
      "annullierungErsatzverbindungAnkunftsZeit",
      "ankuendigung",
      "ersatzflugStartenZweiStunden",
      "ersatzflugLandenVierStunden",
      "ersatzflugStartenEinStunde",
      "ersatzflugLandenZweiStunden",
      "direktAbflugsDatum",
      "direktAbflugsZeit",
      "direktAnkunftsDatum",
      "direktAnkunftsZeit",
    ]),
  );

  const mockData = {
    direktAbflugsDatum: toGermanDateFormat(today()),
    direktAbflugsZeit: "10:00",
    direktAnkunftsDatum: toGermanDateFormat(today()),
    direktAnkunftsZeit: "11:00",
  };

  const validatorCancelFlightReplacementPage =
    validateCancelFlightReplacementPage(baseSchema);

  it("should return success true given undefined values", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      ...mockData,
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
      ...mockData,
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
      ...mockData,
      annullierungErsatzverbindungFlugnummer: undefined,
      annullierungErsatzverbindungAbflugsDatum: undefined,
      annullierungErsatzverbindungAbflugsZeit: "14:00",
      annullierungErsatzverbindungAnkunftsDatum: undefined,
      annullierungErsatzverbindungAnkunftsZeit: undefined,
    });

    expect(result.success).toBe(false);
    expect(result.error!.issues.length).toBe(4);
    expect(
      result.error?.issues.some((issue) =>
        issue.path.includes("annullierungErsatzverbindungAbflugsDatum"),
      ),
    ).toBe(true);
  });

  it("should fail validation when only the departure date is provided", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      ...mockData,
      annullierungErsatzverbindungFlugnummer: undefined,
      annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
      annullierungErsatzverbindungAbflugsZeit: undefined,
      annullierungErsatzverbindungAnkunftsDatum: undefined,
      annullierungErsatzverbindungAnkunftsZeit: undefined,
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBe(4);
    expect(
      result.error?.issues.some((issue) =>
        issue.path.includes("annullierungErsatzverbindungAbflugsZeit"),
      ),
    ).toBe(true);
  });

  it("should fail validation when only the arrival time is provided", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      ...mockData,
      annullierungErsatzverbindungFlugnummer: undefined,
      annullierungErsatzverbindungAbflugsDatum: undefined,
      annullierungErsatzverbindungAbflugsZeit: undefined,
      annullierungErsatzverbindungAnkunftsDatum: undefined,
      annullierungErsatzverbindungAnkunftsZeit: "14:00",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBe(4);
    expect(
      result.error?.issues.some((issue) =>
        issue.path.includes("annullierungErsatzverbindungAnkunftsDatum"),
      ),
    ).toBe(true);
  });

  it("should fail validation when only the arrival date is provided", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      ...mockData,
      annullierungErsatzverbindungFlugnummer: undefined,
      annullierungErsatzverbindungAbflugsDatum: undefined,
      annullierungErsatzverbindungAbflugsZeit: undefined,
      annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
      annullierungErsatzverbindungAnkunftsZeit: undefined,
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBe(4);
    expect(
      result.error?.issues.some((issue) =>
        issue.path.includes("annullierungErsatzverbindungAnkunftsZeit"),
      ),
    ).toBe(true);
  });

  it("should fail validation when only the flight number is provided", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      ...mockData,
      annullierungErsatzverbindungFlugnummer: "AB1234",
      annullierungErsatzverbindungAbflugsDatum: undefined,
      annullierungErsatzverbindungAbflugsZeit: undefined,
      annullierungErsatzverbindungAnkunftsDatum: undefined,
      annullierungErsatzverbindungAnkunftsZeit: undefined,
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBe(4);
    expect(
      result.error?.issues.some((issue) =>
        issue.path.includes("annullierungErsatzverbindungAnkunftsZeit"),
      ),
    ).toBe(true);
  });

  it("should fail validation for all empty fields when at least two field is filled", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      ...mockData,
      annullierungErsatzverbindungFlugnummer: "AB1234",
      annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
      annullierungErsatzverbindungAbflugsZeit: undefined,
      annullierungErsatzverbindungAnkunftsDatum: undefined,
      annullierungErsatzverbindungAnkunftsZeit: undefined,
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toHaveLength(3);
    expect(result.error?.issues).toEqual(
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
      ...mockData,
      annullierungErsatzverbindungFlugnummer: "AB123",
      annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
      annullierungErsatzverbindungAbflugsZeit: "10:00",
      annullierungErsatzverbindungAnkunftsDatum: "02.01.2024",
      annullierungErsatzverbindungAnkunftsZeit: "12:00",
    });
    console.log(result.error);
    expect(result.error).toBeUndefined();
    expect(result.success).toBe(true);
  });

  describe("validate when ankuendigung no", () => {
    const defaultValues = {
      ankuendigung: "no",
      annullierungErsatzverbindungFlugnummer: "AB123",
    };

    const validValuesForDeparture = {
      direktAbflugsDatum: "01.01.2024",
      direktAbflugsZeit: "11:00",
      ersatzflugStartenEinStunde: "yes",
      annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
      annullierungErsatzverbindungAbflugsZeit: "09:30",
    };

    const validValuesForArrivals = {
      direktAnkunftsDatum: "01.01.2024",
      direktAnkunftsZeit: "11:30",
      annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
      annullierungErsatzverbindungAnkunftsZeit: "14:00",
      ersatzflugLandenZweiStunden: "yes",
    };

    describe("check departure", () => {
      it("should fail validation given new departure less than one hour from the original and ersatzflugStartenEinStunde yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: "11:00",
          ersatzflugStartenEinStunde: "yes",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: "10:00",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues).toHaveLength(2);
        expect(result.error?.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: "departureOneHourLateFromOriginalDeparture",
              path: ["annullierungErsatzverbindungAbflugsDatum"],
            }),
            expect.objectContaining({
              message: "departureOneHourLateFromOriginalDeparture",
              path: ["annullierungErsatzverbindungAbflugsZeit"],
            }),
          ]),
        );
      });

      it("should pass given new departure more than one hour from the original and ersatzflugStartenEinStunde yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          ...validValuesForDeparture,
        });

        expect(result.success).toBe(true);
      });

      it("should fail validation given new departure more than one hour from the original and ersatzflugStartenEinStunde no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: "11:00",
          ersatzflugStartenEinStunde: "no",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: "09:45",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues).toHaveLength(2);
        expect(result.error?.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: "departureOneHourLessFromOriginalDeparture",
              path: ["annullierungErsatzverbindungAbflugsDatum"],
            }),
            expect.objectContaining({
              message: "departureOneHourLessFromOriginalDeparture",
              path: ["annullierungErsatzverbindungAbflugsZeit"],
            }),
          ]),
        );
      });

      it("should pass validation given new departure less than one hour from the original and ersatzflugStartenEinStunde no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: "11:00",
          ersatzflugStartenEinStunde: "no",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: "10:01",
        });

        expect(result.success).toBe(true);
      });
    });

    describe("check arrival", () => {
      it("should fail validation given new arrival less than two hours from the original and ersatzflugLandenZweiStunden yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: "11:30",
          ersatzflugLandenZweiStunden: "yes",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: "13:30",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues).toHaveLength(2);
        expect(result.error?.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: "arrivalTwoHoursLateFromOriginalArrival",
              path: ["annullierungErsatzverbindungAnkunftsDatum"],
            }),
            expect.objectContaining({
              message: "arrivalTwoHoursLateFromOriginalArrival",
              path: ["annullierungErsatzverbindungAnkunftsZeit"],
            }),
          ]),
        );
      });

      it("should fail validation given new arrival more than two hours from the original and ersatzflugLandenZweiStunden yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          ...validValuesForArrivals,
        });

        expect(result.success).toBe(true);
      });

      it("should fail validation given new arrival more than two hours from the original and ersatzflugLandenZweiStunden no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: "12:00",
          ersatzflugLandenZweiStunden: "no",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: "14:01",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues).toHaveLength(2);
        expect(result.error?.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: "arrivalTwoHoursLessFromOriginalArrival",
              path: ["annullierungErsatzverbindungAnkunftsDatum"],
            }),
            expect.objectContaining({
              message: "arrivalTwoHoursLessFromOriginalArrival",
              path: ["annullierungErsatzverbindungAnkunftsZeit"],
            }),
          ]),
        );
      });

      it("should pass validation given new arrival less than two hours from the original and ersatzflugLandenZweiStunden no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: "12:00",
          ersatzflugLandenZweiStunden: "no",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: "14:00",
        });

        expect(result.success).toBe(true);
      });
    });
  });

  describe("validate when ankuendigung until6Days", () => {
    const defaultValues = {
      ankuendigung: "until6Days",
      annullierungErsatzverbindungFlugnummer: "AB123",
    };

    const validValuesForDeparture = {
      direktAbflugsDatum: "01.01.2024",
      direktAbflugsZeit: "11:00",
      ersatzflugStartenEinStunde: "yes",
      annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
      annullierungErsatzverbindungAbflugsZeit: "09:30",
    };

    const validValuesForArrivals = {
      direktAnkunftsDatum: "01.01.2024",
      direktAnkunftsZeit: "11:30",
      annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
      annullierungErsatzverbindungAnkunftsZeit: "14:00",
      ersatzflugLandenZweiStunden: "yes",
    };

    describe("check departure", () => {
      it("should fail validation given new departure less than one hour from the original and ersatzflugStartenEinStunde yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: "11:00",
          ersatzflugStartenEinStunde: "yes",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: "10:00",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues).toHaveLength(2);
        expect(result.error?.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: "departureOneHourLateFromOriginalDeparture",
              path: ["annullierungErsatzverbindungAbflugsDatum"],
            }),
            expect.objectContaining({
              message: "departureOneHourLateFromOriginalDeparture",
              path: ["annullierungErsatzverbindungAbflugsZeit"],
            }),
          ]),
        );
      });

      it("should pass given new departure more than one hour from the original and ersatzflugStartenEinStunde yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          ...validValuesForDeparture,
        });

        expect(result.success).toBe(true);
      });

      it("should fail validation given new departure more than one hour from the original and ersatzflugStartenEinStunde no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: "11:00",
          ersatzflugStartenEinStunde: "no",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: "09:45",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues).toHaveLength(2);
        expect(result.error?.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: "departureOneHourLessFromOriginalDeparture",
              path: ["annullierungErsatzverbindungAbflugsDatum"],
            }),
            expect.objectContaining({
              message: "departureOneHourLessFromOriginalDeparture",
              path: ["annullierungErsatzverbindungAbflugsZeit"],
            }),
          ]),
        );
      });

      it("should pass validation given new departure less than one hour from the original and ersatzflugStartenEinStunde no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: "11:00",
          ersatzflugStartenEinStunde: "no",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: "10:01",
        });

        expect(result.success).toBe(true);
      });
    });

    describe("check arrival", () => {
      it("should fail validation given new arrival less than two hours from the original and ersatzflugLandenZweiStunden yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: "11:30",
          ersatzflugLandenZweiStunden: "yes",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: "13:30",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues).toHaveLength(2);
        expect(result.error?.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: "arrivalTwoHoursLateFromOriginalArrival",
              path: ["annullierungErsatzverbindungAnkunftsDatum"],
            }),
            expect.objectContaining({
              message: "arrivalTwoHoursLateFromOriginalArrival",
              path: ["annullierungErsatzverbindungAnkunftsZeit"],
            }),
          ]),
        );
      });

      it("should fail validation given new arrival more than two hours from the original and ersatzflugLandenZweiStunden yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          ...validValuesForArrivals,
        });

        expect(result.success).toBe(true);
      });

      it("should fail validation given new arrival more than two hours from the original and ersatzflugLandenZweiStunden no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: "12:00",
          ersatzflugLandenZweiStunden: "no",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: "14:01",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues).toHaveLength(2);
        expect(result.error?.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: "arrivalTwoHoursLessFromOriginalArrival",
              path: ["annullierungErsatzverbindungAnkunftsDatum"],
            }),
            expect.objectContaining({
              message: "arrivalTwoHoursLessFromOriginalArrival",
              path: ["annullierungErsatzverbindungAnkunftsZeit"],
            }),
          ]),
        );
      });

      it("should pass validation given new arrival less than two hours from the original and ersatzflugLandenZweiStunden no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: "12:00",
          ersatzflugLandenZweiStunden: "no",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: "14:00",
        });

        expect(result.success).toBe(true);
      });
    });
  });

  describe("validate when ankuendigung between7And13Days", () => {
    const defaultValues = {
      ankuendigung: "between7And13Days",
      annullierungErsatzverbindungFlugnummer: "AB123",
    };

    const validValuesForDeparture = {
      direktAbflugsDatum: "01.01.2024",
      direktAbflugsZeit: "12:00",
      ersatzflugStartenZweiStunden: "yes",
      annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
      annullierungErsatzverbindungAbflugsZeit: "09:30",
    };

    const validValuesForArrivals = {
      direktAnkunftsDatum: "01.01.2024",
      direktAnkunftsZeit: "11:30",
      annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
      annullierungErsatzverbindungAnkunftsZeit: "16:00",
      ersatzflugLandenVierStunden: "yes",
    };

    describe("check departure", () => {
      it("should fail validation given new departure less than two hours from the original and ersatzflugStartenZweiStunden yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: "12:00",
          ersatzflugStartenZweiStunden: "yes",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: "10:00",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues).toHaveLength(2);
        expect(result.error?.issues).toEqual(
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

      it("should pass given new departure more than two hours from the original and ersatzflugStartenZweiStunden yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          ...validValuesForDeparture,
        });

        expect(result.success).toBe(true);
      });

      it("should fail validation given new departure more than two hours from the original and ersatzflugStartenZweiStunden no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: "12:00",
          ersatzflugStartenZweiStunden: "no",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: "09:30",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues).toHaveLength(2);
        expect(result.error?.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: "departureTwoHoursLessFromOriginalDeparture",
              path: ["annullierungErsatzverbindungAbflugsDatum"],
            }),
            expect.objectContaining({
              message: "departureTwoHoursLessFromOriginalDeparture",
              path: ["annullierungErsatzverbindungAbflugsZeit"],
            }),
          ]),
        );
      });

      it("should pass validation given new departure less than two hours from the original and ersatzflugStartenZweiStunden no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: "12:00",
          ersatzflugStartenZweiStunden: "no",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: "10:30",
        });

        expect(result.success).toBe(true);
      });
    });

    describe("check arrival", () => {
      it("should fail validation given new arrival less than four hours from the original and ersatzflugLandenVierStunden yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: "11:30",
          ersatzflugLandenVierStunden: "yes",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: "15:30",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues).toHaveLength(2);
        expect(result.error?.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: "arrivalFourHoursLateFromOriginalArrival",
              path: ["annullierungErsatzverbindungAnkunftsDatum"],
            }),
            expect.objectContaining({
              message: "arrivalFourHoursLateFromOriginalArrival",
              path: ["annullierungErsatzverbindungAnkunftsZeit"],
            }),
          ]),
        );
      });

      it("should fail validation given new arrival more than four hours from the original and ersatzflugLandenVierStunden yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          ...validValuesForArrivals,
        });

        expect(result.success).toBe(true);
      });

      it("should fail validation given new arrival more than four hours from the original and ersatzflugLandenVierStunden no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: "12:00",
          ersatzflugLandenVierStunden: "no",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: "16:01",
        });

        expect(result.success).toBe(false);
        expect(result.error?.issues).toHaveLength(2);
        expect(result.error?.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              message: "arrivalFourHoursLessFromOriginalArrival",
              path: ["annullierungErsatzverbindungAnkunftsDatum"],
            }),
            expect.objectContaining({
              message: "arrivalFourHoursLessFromOriginalArrival",
              path: ["annullierungErsatzverbindungAnkunftsZeit"],
            }),
          ]),
        );
      });

      it("should pass validation given new arrival less than four hours from the original and ersatzflugLandenVierStunden no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: "12:00",
          ersatzflugLandenVierStunden: "no",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: "09:30",
        });

        expect(result.success).toBe(true);
      });
    });
  });
});
