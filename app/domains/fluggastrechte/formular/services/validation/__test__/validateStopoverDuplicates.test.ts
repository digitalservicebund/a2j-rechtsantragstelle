import { z } from "zod";
import { validateStopoverDuplicates } from "../validateStopoverDuplicates";
import { fluggastrechteFlugdatenPages } from "../../../flugdaten/pages";

describe("validateStopoverDuplicates", () => {
  const baseSchema = z.object(
    fluggastrechteFlugdatenPages.flugdatenZwischenstoppUebersicht3.pageSchema,
  );

  const schema = validateStopoverDuplicates(baseSchema);

  it("should pass when only ersterZwischenstopp is filled", () => {
    expect(
      z.validate(schema, {
        startAirport: "BER",
        endAirport: "JFK",
        ersterZwischenstopp: "FRA",
      }),
    ).toBe(true);
  });

  it("should pass when only zweiterZwischenstopp or dritterZwischenstopp is filled", () => {
    expect(
      z.validate(schema, {
        startAirport: "BER",
        endAirport: "JFK",
        zweiterZwischenstopp: "MUC",
      }),
    ).toBe(true);

    expect(
      z.validate(schema, {
        startAirport: "BER",
        endAirport: "JFK",
        dritterZwischenstopp: "LHR",
      }),
    ).toBe(true);
  });

  it("should pass when all stopovers are filled with different values", () => {
    expect(
      z.validate(schema, {
        startAirport: "BER",
        endAirport: "JFK",
        ersterZwischenstopp: "FRA",
        zweiterZwischenstopp: "CDG",
        dritterZwischenstopp: "LHR",
      }),
    ).toBe(true);
  });

  it("should fail when duplicate stopovers exist", () => {
    const result = schema.safeParse({
      startAirport: "BER",
      endAirport: "JFK",
      ersterZwischenstopp: "JFK",
      dritterZwischenstopp: "JFK",
    });

    expect(result.success).toBe(false);
    expect(z.treeifyError(result.error!).properties).toMatchObject({
      ersterZwischenstopp: {
        errors: expect.arrayContaining(["stopoverDuplicates"]),
      },
      dritterZwischenstopp: {
        errors: expect.arrayContaining(["stopoverDuplicates"]),
      },
    });
  });

  it("should fail when all stopovers contain the same value", () => {
    const result = schema.safeParse({
      startAirport: "BER",
      endAirport: "JFK",
      ersterZwischenstopp: "FRA",
      zweiterZwischenstopp: "FRA",
      dritterZwischenstopp: "FRA",
    });

    expect(result.success).toBe(false);
    expect(z.treeifyError(result.error!).properties).toMatchObject({
      ersterZwischenstopp: {
        errors: expect.arrayContaining(["stopoverDuplicates"]),
      },
      zweiterZwischenstopp: {
        errors: expect.arrayContaining(["stopoverDuplicates"]),
      },
      dritterZwischenstopp: {
        errors: expect.arrayContaining(["stopoverDuplicates"]),
      },
    });
  });

  it("should fail when a stopover is the same as the start airport", () => {
    const result = schema.safeParse({
      startAirport: "BER",
      endAirport: "JFK",
      ersterZwischenstopp: "BER",
      zweiterZwischenstopp: "HAM",
    });

    expect(result.success).toBe(false);
    expect(z.treeifyError(result.error!).properties).toMatchObject({
      ersterZwischenstopp: {
        errors: expect.arrayContaining(["initialFlightDuplicates"]),
      },
    });
  });

  it("should fail when a stopover is the same as the end airport", () => {
    const result = schema.safeParse({
      startAirport: "BER",
      endAirport: "LHR",
      ersterZwischenstopp: "FRA",
      zweiterZwischenstopp: "LHR",
    });

    expect(result.success).toBe(false);
    expect(z.treeifyError(result.error!).properties).toMatchObject({
      zweiterZwischenstopp: {
        errors: expect.arrayContaining(["initialFlightDuplicates"]),
      },
    });
  });

  it("should fail when multiple stopovers match start or end airports", () => {
    const result = schema.safeParse({
      startAirport: "FRA",
      endAirport: "LHR",
      ersterZwischenstopp: "FRA",
      zweiterZwischenstopp: "JFK",
      dritterZwischenstopp: "LHR",
    });

    expect(result.success).toBe(false);
    expect(z.treeifyError(result.error!).properties).toMatchObject({
      ersterZwischenstopp: {
        errors: expect.arrayContaining(["initialFlightDuplicates"]),
      },
      dritterZwischenstopp: {
        errors: expect.arrayContaining(["initialFlightDuplicates"]),
      },
    });
  });

  it("should pass when start, end and stopover airports are all different", () => {
    expect(
      z.validate(schema, {
        startAirport: "BER",
        endAirport: "LHR",
        ersterZwischenstopp: "FRA",
        zweiterZwischenstopp: "JFK",
        dritterZwischenstopp: "CDG",
      }),
    ).toBe(true);
  });
});
