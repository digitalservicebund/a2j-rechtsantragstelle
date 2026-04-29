import {
  strapiPaddingOptions,
  StrapiPaddingOptionalSchema,
} from "../StrapiPadding";

describe("StrapiPadding", () => {
  it("converts all valid options", () => {
    strapiPaddingOptions.forEach((option) => {
      const parsed = StrapiPaddingOptionalSchema.safeParse(option);
      expect(parsed.success).toBe(true);
    });
  });
});
