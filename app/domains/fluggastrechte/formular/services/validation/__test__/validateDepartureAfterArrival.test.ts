import { z } from "zod";
import { validateDepartureAfterArrival } from "../validateDepartureAfterArrival";
import { fluggastrechteFlugdatenPages } from "../../../flugdaten/pages";
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
    const result = z.validate(validator, {
      direktAbflugsDatum: undefined,
      direktAbflugsZeit: undefined,
      direktAnkunftsDatum: undefined,
      direktAnkunftsZeit: undefined,
    });

    expect(result).toBe(false);
  });

  it("should return success false given a departure time after the arrival", () => {
    const result = z.validate(validator, {
      direktAbflugsDatum: {
        day: "01",
        month: "01",
        year: "2024",
      },
      direktAbflugsZeit: {
        hour: "14",
        minute: "00",
      },
      direktAnkunftsDatum: {
        day: "01",
        month: "01",
        year: "2024",
      },
      direktAnkunftsZeit: {
        hour: "11",
        minute: "00",
      },
    });

    expect(result).toBe(false);
  });

  it("should return success false given a departure date after the arrival", () => {
    const result = z.validate(validator, {
      direktAbflugsDatum: {
        day: "02",
        month: "01",
        year: "2024",
      },
      direktAbflugsZeit: {
        hour: "14",
        minute: "00",
      },
      direktAnkunftsDatum: {
        day: "01",
        month: "01",
        year: "2024",
      },
      direktAnkunftsZeit: {
        hour: "15",
        minute: "00",
      },
    });

    expect(result).toBe(false);
  });

  it("should return success true given a departure date before the arrival", () => {
    const result = z.validate(validator, {
      direktAbflugsDatum: {
        day: "01",
        month: "01",
        year: "2024",
      },
      direktAbflugsZeit: {
        hour: "14",
        minute: "00",
      },
      direktAnkunftsDatum: {
        day: "02",
        month: "01",
        year: "2024",
      },
      direktAnkunftsZeit: {
        hour: "10",
        minute: "00",
      },
    });

    expect(result).toBe(true);
  });

  it("should return success true given a departure time before the arrival", () => {
    const result = z.validate(validator, {
      direktAbflugsDatum: {
        day: "01",
        month: "01",
        year: "2024",
      },
      direktAbflugsZeit: {
        hour: "14",
        minute: "00",
      },
      direktAnkunftsDatum: {
        day: "01",
        month: "01",
        year: "2024",
      },
      direktAnkunftsZeit: {
        hour: "15",
        minute: "00",
      },
    });

    expect(result).toBe(true);
  });

  it("should return success false given a departure date time equal arrival", () => {
    const result = z.validate(validator, {
      direktAbflugsDatum: {
        day: "01",
        month: "01",
        year: "2024",
      },
      direktAbflugsZeit: {
        hour: "14",
        minute: "00",
      },
      direktAnkunftsDatum: {
        day: "01",
        month: "01",
        year: "2024",
      },
      direktAnkunftsZeit: {
        hour: "14",
        minute: "00",
      },
    });

    expect(result).toBe(false);
  });
});
