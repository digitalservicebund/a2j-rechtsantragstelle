import { z } from "zod";
import { validateBirthDateDeathDate } from "~/domains/nachlass/services/validation/validateBirthDateDeathDate";
import { translations } from "~/services/translations/translations";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { schemaOrEmptyStringOptional } from "~/services/validation/schemaOrEmptyString";

const dateSchema = createSplitDateSchema({
  earliest: () => new Date(1900, 0, 1),
  latest: () => new Date(2024, 0, 1),
});

describe("validateBirthDateDeathDate", () => {
  const schema = z.object({
    birthDate: dateSchema,
    deathDate: dateSchema,
  });

  it("shouldn't return any errors if the birth date is before the death date", () => {
    const birthDate = { day: "1", month: "1", year: "2000" };
    const deathDate = { day: "1", month: "1", year: "2020" };
    const result = validateBirthDateDeathDate(
      "birthDate",
      "deathDate",
      "birthDate",
    )(schema).safeParse({ birthDate, deathDate });
    expect(result.success).toBe(true);
  });

  it("shouldn't return any errors when testing the birth date and death date isn't defined", () => {
    const birthDate = { day: "1", month: "1", year: "2000" };
    const result = validateBirthDateDeathDate(
      "birthDate",
      "deathDate",
      "birthDate",
    )(
      schema.extend({
        deathDate: schemaOrEmptyStringOptional(dateSchema),
      }),
    ).safeParse({ birthDate });
    expect(result.success).toBe(true);
  });

  it("shouldn't return any errors when testing the death date and birth date isn't defined", () => {
    const deathDate = { day: "1", month: "1", year: "2000" };
    const result = validateBirthDateDeathDate(
      "birthDate",
      "deathDate",
      "deathDate",
    )(
      schema.extend({
        birthDate: schemaOrEmptyStringOptional(dateSchema),
      }),
    ).safeParse({ deathDate });
    expect(result.success).toBe(true);
  });

  it("shouldn't return any errors if the death date is after the birth date", () => {
    const birthDate = { day: "1", month: "1", year: "2000" };
    const deathDate = { day: "1", month: "1", year: "2020" };
    const result = validateBirthDateDeathDate(
      "birthDate",
      "deathDate",
      "deathDate",
    )(schema).safeParse({ birthDate, deathDate });
    expect(result.success).toBe(true);
  });

  it("should return an error if the birth date is after the death date", () => {
    const birthDate = { day: "1", month: "1", year: "2020" };
    const deathDate = { day: "1", month: "1", year: "2000" };
    const result = validateBirthDateDeathDate(
      "birthDate",
      "deathDate",
      "birthDate",
    )(schema).safeParse({ birthDate, deathDate });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      translations.nachlass.birthDateAfterDeathDateError.de,
    );
  });

  it("should return an error if the death date is before the birth date", () => {
    const birthDate = { day: "1", month: "1", year: "2020" };
    const deathDate = { day: "1", month: "1", year: "2019" };
    const result = validateBirthDateDeathDate(
      "birthDate",
      "deathDate",
      "deathDate",
    )(schema).safeParse({ birthDate, deathDate });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      translations.nachlass.deathDateBeforeBirthDateError.de,
    );
  });
});
