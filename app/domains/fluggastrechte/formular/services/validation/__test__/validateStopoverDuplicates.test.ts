import pick from "lodash/pick";
import { z } from "zod";
import { fluggastrechteInputSchema } from "../../../userData";
import { validateStopoverDuplicates } from "../validateStopoverDuplicates";

describe("validateStopoverDuplicates", () => {
  const baseSchema = z.object(
    pick(fluggastrechteInputSchema, [
      "ersterZwischenstopp",
      "zweiterZwischenstopp",
      "dritterZwischenstopp",
      "startAirport",
      "endAirport",
    ]),
  );

  const schema = validateStopoverDuplicates(baseSchema);

  it("should pass when only ersterZwischenstopp is filled", () => {
    const result = schema.safeParse({
      startAirport: "BER",
      endAirport: "JFK",
      ersterZwischenstopp: "FRA",
    });
    expect(result.success).toBe(true);
  });

  it("should pass when only zweiterZwischenstopp or dritterZwischenstopp is filled", () => {
    const firstResult = schema.safeParse({
      startAirport: "BER",
      endAirport: "JFK",
      zweiterZwischenstopp: "MUC",
    });
    expect(firstResult.success).toBe(true);

    const secondResult = schema.safeParse({
      startAirport: "BER",
      endAirport: "JFK",
      dritterZwischenstopp: "LHR",
    });
    expect(secondResult.success).toBe(true);
  });

  it("should pass when all stopovers are filled with different values", () => {
    const result = schema.safeParse({
      startAirport: "BER",
      endAirport: "JFK",
      ersterZwischenstopp: "FRA",
      zweiterZwischenstopp: "CDG",
      dritterZwischenstopp: "LHR",
    });
    expect(result.success).toBe(true);
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
    const result = schema.safeParse({
      startAirport: "BER",
      endAirport: "LHR",
      ersterZwischenstopp: "FRA",
      zweiterZwischenstopp: "JFK",
      dritterZwischenstopp: "CDG",
    });

    expect(result.success).toBe(true);
  });
});
