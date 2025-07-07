import { strapiPaddingOptions, StrapiPaddingSchema } from "../StrapiPadding";

describe("StrapiPadding", () => {
  it("converts all valid options", () => {
    strapiPaddingOptions.forEach((option) => {
      const parsed = StrapiPaddingSchema.safeParse(option);
      expect(parsed.success).toBe(true);
    });
  });
});
