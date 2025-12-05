import { z } from "zod";
import { validateSameFlightPage } from "../validateSameFlightPage";
import { fourYearsAgoSchema } from "../../../flugdaten/pages";
import { timeSchema } from "~/services/validation/time";

describe("validateSameFlightPage", () => {
  const baseSchema = z.object({
    direktAnkunftsDatum: fourYearsAgoSchema,
    direktAnkunftsZeit: timeSchema,
    tatsaechlicherAnkunftsDatum: fourYearsAgoSchema,
    tatsaechlicherAnkunftsZeit: timeSchema,
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
