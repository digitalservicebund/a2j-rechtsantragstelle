import { z } from "zod";
import { StrapiBackgroundColorSchema } from "./StrapiBackgroundColor";
import { StrapiPaddingSchema } from "./StrapiPadding";

export const StrapiWrapperSchema = z.object({
  backgroundColor: StrapiBackgroundColorSchema.nullable(),
  paddingTop: StrapiPaddingSchema.nullable(),
  paddingBottom: StrapiPaddingSchema.nullable(),
});
