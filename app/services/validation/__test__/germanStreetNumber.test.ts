import { germanStreetNumberSchema } from "../germanStreetNumber";

describe("germanStreetNumber validation", () => {
  const validCases = [
    "1",
    "12",
    "1/2",
    "2 1/3",
    "1-2",
    "1 - 2",
    "1a",
    "122a",
    "1 a",
    "1A",
    "1 1/2 A",
    "61 - 61s",
    "61-62",
    "61b/61c/23d",
  ] as const;

  validCases.forEach((validCase) => {
    it(`should be valid for ${validCase}`, () => {
      const actual = germanStreetNumberSchema.safeParse(validCase);
      expect(actual).toEqual({ data: validCase, success: true });
    });
  });

  it("should trim", () => {
    const actual = germanStreetNumberSchema.safeParse(" 1 ");
    expect(actual).toEqual({ data: "1", success: true });
  });

  const invalidCases = ["", "1aa", "1//", "|", "1#", "2-----"] as const;

  invalidCases.forEach((invalidCases) => {
    it(`should be invalid for ${invalidCases}`, () => {
      const actual = germanStreetNumberSchema.safeParse(invalidCases);
      expect(actual.success).toBe(false);
    });
  });
});
