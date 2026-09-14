import { z } from "zod";
import {
  strapiPaddingOptions,
  StrapiPaddingOptionalSchema,
} from "../StrapiPadding";

describe("StrapiPadding", () => {
  it("accepts all valid padding values", () => {
    strapiPaddingOptions.forEach((option) => {
      expect(z.validate(StrapiPaddingOptionalSchema, option)).toBe(true);
    });
  });

  it("rejects invalid padding values", () => {
    expect(z.validate(StrapiPaddingOptionalSchema, "invalid")).toBe(false);
  });
});
