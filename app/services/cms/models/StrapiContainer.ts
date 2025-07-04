import { z } from "zod";
import { StrapiBackgroundColorSchema } from "./StrapiBackgroundColor";
import { StrapiPaddingSchema } from "./StrapiPadding";

export const StrapiContainerSchema = z.object({
  backgroundColor: StrapiBackgroundColorSchema,
  paddingTop: StrapiPaddingSchema,
  paddingBottom: StrapiPaddingSchema,
});
