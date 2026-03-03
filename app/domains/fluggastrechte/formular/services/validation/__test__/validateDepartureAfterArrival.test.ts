import { z } from "zod";
import { validateDepartureAfterArrival } from "../validateDepartureAfterArrival";
import { fluggastrechteFlugdatenPages } from "../../../flugdaten/pages";
import { splitDate } from "./testUtils";
import { pick } from "lodash";

describe("validateDepartureAfterArrival", () => {
  const baseSchema = z.object(
    pick(fluggastrechteFlugdatenPages.flugdatenGeplanterFlug.pageSchema, [
      "direktAbflugsDatum",
      "direktAbflugsZeit",
      "direktAnkunftsDatum",
      "direktAnkunftsZeit",
    ]),
  );

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
      direktAbflugsDatum: splitDate("01.01.2024"),
      direktAbflugsZeit: "14:00",
      direktAnkunftsDatum: splitDate("01.01.2024"),
      direktAnkunftsZeit: "11:00",
    });

    expect(result.success).toBe(false);
  });

  it("should return success false given a departure date after the arrival", () => {
    const result = validator.safeParse({
      direktAbflugsDatum: splitDate("02.01.2024"),
      direktAbflugsZeit: "14:00",
      direktAnkunftsDatum: splitDate("01.01.2024"),
      direktAnkunftsZeit: "15:00",
    });

    expect(result.success).toBe(false);
  });

  it("should return success true given a departure date before the arrival", () => {
    const result = validator.safeParse({
      direktAbflugsDatum: splitDate("01.01.2024"),
      direktAbflugsZeit: "14:00",
      direktAnkunftsDatum: splitDate("02.01.2024"),
      direktAnkunftsZeit: "10:00",
    });

    expect(result.success).toBe(true);
  });

  it("should return success true given a departure time before the arrival", () => {
    const result = validator.safeParse({
      direktAbflugsDatum: splitDate("01.01.2024"),
      direktAbflugsZeit: "14:00",
      direktAnkunftsDatum: splitDate("01.01.2024"),
      direktAnkunftsZeit: "15:00",
    });

    expect(result.success).toBe(true);
  });

  it("should return success false given a departure date time equal arrival", () => {
    const result = validator.safeParse({
      direktAbflugsDatum: splitDate("01.01.2024"),
      direktAbflugsZeit: "14:00",
      direktAnkunftsDatum: splitDate("01.01.2024"),
      direktAnkunftsZeit: "14:00",
    });

    expect(result.success).toBe(false);
  });
});
