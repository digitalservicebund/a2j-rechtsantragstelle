import { z } from "zod";
import { validateReplacementConnectionPage } from "../validateReplacementConnectionPage";
import { fluggastrechteFlugdatenPages } from "../../../flugdaten/pages";
import { splitDate } from "./testUtils";
import { pick } from "lodash";

describe("validateReplacementConnectionPage", () => {
  const baseSchema = z.object(
    pick(
      fluggastrechteFlugdatenPages.flugdatenErsatzverbindungBeschreibung
        .pageSchema,
      [
        "direktAnkunftsDatum",
        "direktAnkunftsZeit",
        "andereErsatzverbindungAnkunftsDatum",
        "andereErsatzverbindungAnkunftsZeit",
        "bereich",
      ],
    ),
  );

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
      direktAnkunftsDatum: splitDate("01.01.2024"),
      direktAnkunftsZeit: "14:00",
      andereErsatzverbindungAnkunftsDatum: splitDate("01.01.2024"),
      andereErsatzverbindungAnkunftsZeit: "11:00",
      bereich: "verspaetet",
    });

    expect(result.success).toBe(false);
  });

  it("should return success false given an original arrival date after the arrival", () => {
    const result = validatorReplacementConnectionPage.safeParse({
      direktAnkunftsDatum: splitDate("02.01.2024"),
      direktAnkunftsZeit: "14:00",
      andereErsatzverbindungAnkunftsDatum: splitDate("01.01.2024"),
      andereErsatzverbindungAnkunftsZeit: "15:00",
      bereich: "verspaetet",
    });

    expect(result.success).toBe(false);
  });

  it("should return success false given an original arrival date before three hours after the arrival and bereich verspaetet", () => {
    const result = validatorReplacementConnectionPage.safeParse({
      direktAnkunftsDatum: splitDate("02.01.2024"),
      direktAnkunftsZeit: "14:00",
      andereErsatzverbindungAnkunftsDatum: splitDate("02.01.2024"),
      andereErsatzverbindungAnkunftsZeit: "15:00",
      bereich: "verspaetet",
    });

    expect(result.success).toBe(false);
  });

  it("should return success true given an original arrival date after three hours after the arrival and bereich verspaetet", () => {
    const result = validatorReplacementConnectionPage.safeParse({
      direktAnkunftsDatum: splitDate("02.01.2024"),
      direktAnkunftsZeit: "14:00",
      andereErsatzverbindungAnkunftsDatum: splitDate("02.01.2024"),
      andereErsatzverbindungAnkunftsZeit: "19:01",
      bereich: "verspaetet",
    });

    expect(result.success).toBe(true);
  });

  it("should return success true given an original arrival date before three hours after the arrival and bereich annullierung", () => {
    const result = validatorReplacementConnectionPage.safeParse({
      direktAnkunftsDatum: splitDate("02.01.2024"),
      direktAnkunftsZeit: "14:00",
      andereErsatzverbindungAnkunftsDatum: splitDate("02.01.2024"),
      andereErsatzverbindungAnkunftsZeit: "15:00",
      bereich: "annullierung",
    });

    expect(result.success).toBe(true);
  });

  it("should return success true given an original arrival date before three hours after the arrival and bereich nichtbefoerderung", () => {
    const result = validatorReplacementConnectionPage.safeParse({
      direktAnkunftsDatum: splitDate("02.01.2024"),
      direktAnkunftsZeit: "14:00",
      andereErsatzverbindungAnkunftsDatum: splitDate("02.01.2024"),
      andereErsatzverbindungAnkunftsZeit: "15:00",
      bereich: "nichtbefoerderung",
    });

    expect(result.success).toBe(true);
  });
});
