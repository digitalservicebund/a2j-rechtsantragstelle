import {
  strapiPaddingOptions,
  StrapiPaddingOptionalSchema,
} from "../StrapiPadding";

describe("StrapiPadding", () => {
  it("accepts all valid padding values", () => {
    strapiPaddingOptions.forEach((option) => {
      const parsed = StrapiPaddingOptionalSchema.safeParse(option);
      expect(parsed.success).toBe(true);
    });
  });

  it("rejects invalid padding values", () => {
    const parsed = StrapiPaddingOptionalSchema.safeParse("invalid");
    expect(parsed.success).toBe(false);
  });
});
