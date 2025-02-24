import { StrapiStringOptionalSchema } from "../StrapiStringOptional";

describe("StrapiStringOptionalSchema", () => {
  it("should return success true and undefined string given null object", () => {
    const nullString = null;

    const actual = StrapiStringOptionalSchema.safeParse(nullString);

    expect(actual.success).toBe(true);
    expect(actual.data).toBeUndefined();
  });

  it("should return success true and undefined string given undefined object", () => {
    const undefinedString = undefined;

    const actual = StrapiStringOptionalSchema.safeParse(undefinedString);

    expect(actual.success).toBe(true);
    expect(actual.data).toBeUndefined();
  });

  it("should return success true and value string given value object", () => {
    const valueString = "test";

    const actual = StrapiStringOptionalSchema.safeParse(valueString);

    expect(actual.success).toBe(true);
    expect(actual.data).toBe(valueString);
  });
});
