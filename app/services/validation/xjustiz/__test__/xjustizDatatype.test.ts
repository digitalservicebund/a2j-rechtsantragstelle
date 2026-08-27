import { z } from "zod";
import { translations } from "~/services/translations/translations";
import { datatypeA } from "../xjustizDatatype";

describe("xjustiz datatype check", () => {
  const requiredSchema = z.string().trim().min(1).check(datatypeA);
  const optionalSchema = z.string().trim().optional().check(datatypeA);

  it("should pass a value that only uses allowed characters", () => {
    expect(requiredSchema.safeParse("Erika Musterfrau")).toEqual({
      data: "Erika Musterfrau",
      success: true,
    });
  });

  it("should report the rejected characters in the translated message", () => {
    const actual = requiredSchema.safeParse("Max 1 & Co");

    expect(actual.error?.issues[0].message).toBe(
      `${translations.xjustiz.invalidCharacters.de} 1, &`,
    );
  });

  it("should list a repeated character only once", () => {
    const actual = requiredSchema.safeParse("111");

    expect(actual.error?.issues[0].message).toBe(
      `${translations.xjustiz.invalidCharacters.de} 1`,
    );
  });

  it("should skip an optional field that was left empty", () => {
    expect(optionalSchema.safeParse(undefined)).toEqual({
      data: undefined,
      success: true,
    });
  });
});
