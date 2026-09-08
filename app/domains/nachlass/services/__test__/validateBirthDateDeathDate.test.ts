import { validateBirthDateDeathDate } from "~/domains/nachlass/services/validation/validateBirthDateDeathDate";
import { createSplitDateSchema } from "~/services/validation/dateObject";

describe("validateBirthDateDeathDate", () => {
  it("shouldn't return any errors if the birth date is before the death date", () => {
    const schema = createSplitDateSchema({
      earliest: () => new Date(1900, 0, 1),
      latest: () => new Date(2024, 0, 1),
    });

    const birthDate = { day: "1", month: "1", year: "2000" };
    const deathDate = { day: "1", month: "1", year: "2020" };
    const result = validateBirthDateDeathDate(
      "birthDate",
      "deathDate",
      "birthDate",
    )(schema).safeParse({ birthDate, deathDate });

    expect(result.success).toBe(true);
  });
});
