import { z } from "zod";
import { validateSameFlightPage } from "../validateSameFlightPage";
import { fluggastrechteFlugdatenPages } from "../../../flugdaten/pages";
import { splitDate } from "./testUtils";
import { pick } from "lodash";

describe("validateSameFlightPage", () => {
  const baseSchema = z.object(
    pick(
      fluggastrechteFlugdatenPages.flugdatenTatsaechlicherFlugAnkunft
        .pageSchema,
      [
        "direktAnkunftsDatum",
        "direktAnkunftsZeit",
        "tatsaechlicherAnkunftsDatum",
        "tatsaechlicherAnkunftsZeit",
      ],
    ),
  );

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
      direktAnkunftsDatum: splitDate("01.01.2024"),
      direktAnkunftsZeit: "14:00",
      tatsaechlicherAnkunftsDatum: splitDate("01.01.2024"),
      tatsaechlicherAnkunftsZeit: "11:00",
    });

    expect(result.success).toBe(false);
  });

  it("should return success false given an original arrival date after the arrival", () => {
    const result = validatorSameFlightPage.safeParse({
      direktAnkunftsDatum: splitDate("02.01.2024"),
      direktAnkunftsZeit: "14:00",
      tatsaechlicherAnkunftsDatum: splitDate("01.01.2024"),
      tatsaechlicherAnkunftsZeit: "15:00",
    });

    expect(result.success).toBe(false);
  });

  it("should return success false given an original arrival date before three hours after the arrival", () => {
    const result = validatorSameFlightPage.safeParse({
      direktAnkunftsDatum: splitDate("02.01.2024"),
      direktAnkunftsZeit: "14:00",
      tatsaechlicherAnkunftsDatum: splitDate("02.01.2024"),
      tatsaechlicherAnkunftsZeit: "15:00",
    });

    expect(result.success).toBe(false);
  });

  it("should return success true given an original arrival date after three hours after the arrival", () => {
    const result = validatorSameFlightPage.safeParse({
      direktAnkunftsDatum: splitDate("02.01.2024"),
      direktAnkunftsZeit: "14:00",
      tatsaechlicherAnkunftsDatum: splitDate("02.01.2024"),
      tatsaechlicherAnkunftsZeit: "19:01",
    });

    expect(result.success).toBe(true);
  });
});
