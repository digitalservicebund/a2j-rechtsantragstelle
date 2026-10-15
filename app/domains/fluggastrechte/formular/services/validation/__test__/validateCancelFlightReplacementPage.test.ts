import { z } from "zod";
import { today, toGermanDateString } from "~/util/date";
import { validateCancelFlightReplacementPage } from "../validateCancelFlightReplacementPage";
import { fluggastrechteFlugdatenPages } from "../../../flugdaten/pages";

describe("validateCancelFlightReplacementPage", () => {
  const baseSchema = z.object({
    ...fluggastrechteFlugdatenPages.flugdatenErsatzverbindungDaten.pageSchema,
  });

  const mockData = {
    direktAbflugsDatum: toGermanDateString(today()),
    direktAbflugsZeit: {
      hour: "10",
      minute: "00",
    },
    direktAnkunftsDatum: toGermanDateString(today()),
    direktAnkunftsZeit: {
      hour: "11",
      minute: "00",
    },
    ankuendigung: "no",
  };

  const validatorCancelFlightReplacementPage =
    validateCancelFlightReplacementPage(baseSchema);

  it("should return success true given all empty strings", () => {
    expect(
      z.validate(validatorCancelFlightReplacementPage, {
        ...mockData,
        annullierungErsatzverbindungFlugnummer: "",
        annullierungErsatzverbindungAbflugsDatum: "",
        annullierungErsatzverbindungAbflugsZeit: "",
        annullierungErsatzverbindungAnkunftsDatum: "",
        annullierungErsatzverbindungAnkunftsZeit: "",
      }),
    ).toBe(true);
  });

  it("should fail validation when only the departure time is provided", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      ...mockData,
      annullierungErsatzverbindungFlugnummer: "",
      annullierungErsatzverbindungAbflugsDatum: "",
      annullierungErsatzverbindungAbflugsZeit: {
        hour: "14",
        minute: "00",
      },
      annullierungErsatzverbindungAnkunftsDatum: "",
      annullierungErsatzverbindungAnkunftsZeit: "",
    });

    expect(result.success).toBe(false);
    expect(result.error!.issues).toHaveLength(4);
    expect(
      result.error?.issues.some((issue) =>
        issue.path.includes("annullierungErsatzverbindungAbflugsDatum"),
      ),
    ).toBe(true);
  });

  it("should fail validation when only the departure date is provided", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      ...mockData,
      annullierungErsatzverbindungFlugnummer: "",
      annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
      annullierungErsatzverbindungAbflugsZeit: "",
      annullierungErsatzverbindungAnkunftsDatum: "",
      annullierungErsatzverbindungAnkunftsZeit: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toHaveLength(4);
    expect(
      result.error?.issues.some((issue) =>
        issue.path.includes("annullierungErsatzverbindungAbflugsZeit"),
      ),
    ).toBe(true);
  });

  it("should fail validation when only the arrival time is provided", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      ...mockData,
      annullierungErsatzverbindungFlugnummer: "",
      annullierungErsatzverbindungAbflugsDatum: "",
      annullierungErsatzverbindungAbflugsZeit: "",
      annullierungErsatzverbindungAnkunftsDatum: "",
      annullierungErsatzverbindungAnkunftsZeit: {
        hour: "14",
        minute: "00",
      },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toHaveLength(4);
    expect(
      result.error?.issues.some((issue) =>
        issue.path.includes("annullierungErsatzverbindungAnkunftsDatum"),
      ),
    ).toBe(true);
  });

  it("should fail validation when only the arrival date is provided", () => {
    const result = validatorCancelFlightReplacementPage.safeParse({
      ...mockData,
      annullierungErsatzverbindungFlugnummer: "",
      annullierungErsatzverbindungAbflugsDatum: "",
      annullierungErsatzverbindungAbflugsZeit: "",
      annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
      annullierungErsatzverbindungAnkunftsZeit: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toHaveLength(4);
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
      annullierungErsatzverbindungAbflugsDatum: "",
      annullierungErsatzverbindungAbflugsZeit: "",
      annullierungErsatzverbindungAnkunftsDatum: "",
      annullierungErsatzverbindungAnkunftsZeit: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toHaveLength(4);
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
      annullierungErsatzverbindungAbflugsZeit: "",
      annullierungErsatzverbindungAnkunftsDatum: "",
      annullierungErsatzverbindungAnkunftsZeit: "",
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
    expect(
      z.validate(validatorCancelFlightReplacementPage, {
        ...mockData,
        annullierungErsatzverbindungFlugnummer: "AB123",
        annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
        annullierungErsatzverbindungAbflugsZeit: {
          hour: "10",
          minute: "00",
        },
        annullierungErsatzverbindungAnkunftsDatum: "02.01.2024",
        annullierungErsatzverbindungAnkunftsZeit: {
          hour: "12",
          minute: "00",
        },
      }),
    ).toBe(true);
  });

  describe("validate when ankuendigung no", () => {
    const defaultValues = {
      ankuendigung: "no",
      annullierungErsatzverbindungFlugnummer: "AB123",
    };

    const validValuesForDeparture = {
      direktAbflugsDatum: "01.01.2024",
      direktAbflugsZeit: {
        hour: "11",
        minute: "00",
      },
      ersatzflugStartenEinStunde: "yes",
      annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
      annullierungErsatzverbindungAbflugsZeit: {
        hour: "09",
        minute: "30",
      },
    };

    const validValuesForArrivals = {
      direktAnkunftsDatum: "01.01.2024",
      direktAnkunftsZeit: {
        hour: "11",
        minute: "30",
      },
      annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
      annullierungErsatzverbindungAnkunftsZeit: {
        hour: "14",
        minute: "00",
      },
      ersatzflugLandenZweiStunden: "yes",
    };

    describe("check departure", () => {
      it("should fail validation given new departure less than one hour from the original and ersatzflugStartenEinStunde yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: {
            hour: "11",
            minute: "00",
          },
          ersatzflugStartenEinStunde: "yes",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: {
            hour: "10",
            minute: "00",
          },
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
        expect(
          z.validate(validatorCancelFlightReplacementPage, {
            ...defaultValues,
            ...validValuesForArrivals,
            ...validValuesForDeparture,
          }),
        ).toBe(true);
      });

      it("should fail validation given new departure more than one hour from the original and ersatzflugStartenEinStunde no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: {
            hour: "11",
            minute: "00",
          },
          ersatzflugStartenEinStunde: "no",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: {
            hour: "09",
            minute: "45",
          },
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
        expect(
          z.validate(validatorCancelFlightReplacementPage, {
            ...defaultValues,
            ...validValuesForArrivals,
            direktAbflugsDatum: "01.01.2024",
            direktAbflugsZeit: {
              hour: "11",
              minute: "00",
            },
            ersatzflugStartenEinStunde: "no",
            annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
            annullierungErsatzverbindungAbflugsZeit: {
              hour: "10",
              minute: "01",
            },
          }),
        ).toBe(true);
      });
    });

    describe("check arrival", () => {
      it("should fail validation given new arrival less than two hours from the original and ersatzflugLandenZweiStunden yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: {
            hour: "11",
            minute: "30",
          },
          ersatzflugLandenZweiStunden: "yes",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: {
            hour: "13",
            minute: "30",
          },
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
        expect(
          z.validate(validatorCancelFlightReplacementPage, {
            ...defaultValues,
            ...validValuesForDeparture,
            ...validValuesForArrivals,
          }),
        ).toBe(true);
      });

      it("should fail validation given new arrival more than two hours from the original and ersatzflugLandenZweiStunden no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: {
            hour: "12",
            minute: "00",
          },
          ersatzflugLandenZweiStunden: "no",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: {
            hour: "14",
            minute: "01",
          },
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
        expect(
          z.validate(validatorCancelFlightReplacementPage, {
            ...defaultValues,
            ...validValuesForDeparture,
            direktAnkunftsDatum: "01.01.2024",
            direktAnkunftsZeit: {
              hour: "12",
              minute: "00",
            },
            ersatzflugLandenZweiStunden: "no",
            annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
            annullierungErsatzverbindungAnkunftsZeit: {
              hour: "14",
              minute: "00",
            },
          }),
        ).toBe(true);
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
      direktAbflugsZeit: {
        hour: "11",
        minute: "00",
      },
      ersatzflugStartenEinStunde: "yes",
      annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
      annullierungErsatzverbindungAbflugsZeit: {
        hour: "09",
        minute: "30",
      },
    };

    const validValuesForArrivals = {
      direktAnkunftsDatum: "01.01.2024",
      direktAnkunftsZeit: {
        hour: "11",
        minute: "30",
      },
      annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
      annullierungErsatzverbindungAnkunftsZeit: {
        hour: "14",
        minute: "00",
      },
      ersatzflugLandenZweiStunden: "yes",
    };

    describe("check departure", () => {
      it("should fail validation given new departure less than one hour from the original and ersatzflugStartenEinStunde yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: {
            hour: "11",
            minute: "00",
          },
          ersatzflugStartenEinStunde: "yes",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: {
            hour: "10",
            minute: "00",
          },
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
        expect(
          z.validate(validatorCancelFlightReplacementPage, {
            ...defaultValues,
            ...validValuesForArrivals,
            ...validValuesForDeparture,
          }),
        ).toBe(true);
      });

      it("should fail validation given new departure more than one hour from the original and ersatzflugStartenEinStunde no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: {
            hour: "11",
            minute: "00",
          },
          ersatzflugStartenEinStunde: "no",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: {
            hour: "09",
            minute: "45",
          },
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
        expect(
          z.validate(validatorCancelFlightReplacementPage, {
            ...defaultValues,
            ...validValuesForArrivals,
            direktAbflugsDatum: "01.01.2024",
            direktAbflugsZeit: {
              hour: "11",
              minute: "00",
            },
            ersatzflugStartenEinStunde: "no",
            annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
            annullierungErsatzverbindungAbflugsZeit: {
              hour: "10",
              minute: "01",
            },
          }),
        ).toBe(true);
      });
    });

    describe("check arrival", () => {
      it("should fail validation given new arrival less than two hours from the original and ersatzflugLandenZweiStunden yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: {
            hour: "11",
            minute: "30",
          },
          ersatzflugLandenZweiStunden: "yes",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: {
            hour: "13",
            minute: "30",
          },
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
        expect(
          z.validate(validatorCancelFlightReplacementPage, {
            ...defaultValues,
            ...validValuesForDeparture,
            ...validValuesForArrivals,
          }),
        ).toBe(true);
      });

      it("should fail validation given new arrival more than two hours from the original and ersatzflugLandenZweiStunden no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: {
            hour: "12",
            minute: "00",
          },
          ersatzflugLandenZweiStunden: "no",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: {
            hour: "14",
            minute: "01",
          },
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
        expect(
          z.validate(validatorCancelFlightReplacementPage, {
            ...defaultValues,
            ...validValuesForDeparture,
            direktAnkunftsDatum: "01.01.2024",
            direktAnkunftsZeit: {
              hour: "12",
              minute: "00",
            },
            ersatzflugLandenZweiStunden: "no",
            annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
            annullierungErsatzverbindungAnkunftsZeit: {
              hour: "14",
              minute: "00",
            },
          }),
        ).toBe(true);
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
      direktAbflugsZeit: {
        hour: "12",
        minute: "00",
      },
      ersatzflugStartenZweiStunden: "yes",
      annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
      annullierungErsatzverbindungAbflugsZeit: {
        hour: "09",
        minute: "30",
      },
    };

    const validValuesForArrivals = {
      direktAnkunftsDatum: "01.01.2024",
      direktAnkunftsZeit: {
        hour: "11",
        minute: "30",
      },
      annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
      annullierungErsatzverbindungAnkunftsZeit: {
        hour: "16",
        minute: "00",
      },
      ersatzflugLandenVierStunden: "yes",
    };

    describe("check departure", () => {
      it("should fail validation given new departure less than two hours from the original and ersatzflugStartenZweiStunden yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: {
            hour: "12",
            minute: "00",
          },
          ersatzflugStartenZweiStunden: "yes",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: {
            hour: "10",
            minute: "00",
          },
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
        expect(
          z.validate(validatorCancelFlightReplacementPage, {
            ...defaultValues,
            ...validValuesForArrivals,
            ...validValuesForDeparture,
          }),
        ).toBe(true);
      });

      it("should fail validation given new departure more than two hours from the original and ersatzflugStartenZweiStunden no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForArrivals,
          direktAbflugsDatum: "01.01.2024",
          direktAbflugsZeit: {
            hour: "12",
            minute: "00",
          },
          ersatzflugStartenZweiStunden: "no",
          annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
          annullierungErsatzverbindungAbflugsZeit: {
            hour: "09",
            minute: "30",
          },
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
        expect(
          z.validate(validatorCancelFlightReplacementPage, {
            ...defaultValues,
            ...validValuesForArrivals,
            direktAbflugsDatum: "01.01.2024",
            direktAbflugsZeit: {
              hour: "12",
              minute: "00",
            },
            ersatzflugStartenZweiStunden: "no",
            annullierungErsatzverbindungAbflugsDatum: "01.01.2024",
            annullierungErsatzverbindungAbflugsZeit: {
              hour: "10",
              minute: "30",
            },
          }),
        ).toBe(true);
      });
    });

    describe("check arrival", () => {
      it("should fail validation given new arrival less than four hours from the original and ersatzflugLandenVierStunden yes", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: {
            hour: "11",
            minute: "30",
          },
          ersatzflugLandenVierStunden: "yes",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: {
            hour: "15",
            minute: "30",
          },
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
        expect(
          z.validate(validatorCancelFlightReplacementPage, {
            ...defaultValues,
            ...validValuesForDeparture,
            ...validValuesForArrivals,
          }),
        ).toBe(true);
      });

      it("should fail validation given new arrival more than four hours from the original and ersatzflugLandenVierStunden no", () => {
        const result = validatorCancelFlightReplacementPage.safeParse({
          ...defaultValues,
          ...validValuesForDeparture,
          direktAnkunftsDatum: "01.01.2024",
          direktAnkunftsZeit: {
            hour: "12",
            minute: "00",
          },
          ersatzflugLandenVierStunden: "no",
          annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
          annullierungErsatzverbindungAnkunftsZeit: {
            hour: "16",
            minute: "01",
          },
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
        expect(
          z.validate(validatorCancelFlightReplacementPage, {
            ...defaultValues,
            ...validValuesForDeparture,
            direktAnkunftsDatum: "01.01.2024",
            direktAnkunftsZeit: {
              hour: "12",
              minute: "00",
            },
            ersatzflugLandenVierStunden: "no",
            annullierungErsatzverbindungAnkunftsDatum: "01.01.2024",
            annullierungErsatzverbindungAnkunftsZeit: {
              hour: "09",
              minute: "30",
            },
          }),
        ).toBe(true);
      });
    });
  });
});
