import { z } from "zod";
import { StrapiBackgroundColorSchema } from "./StrapiBackgroundColor";
import { PaddingSchema } from "./Padding";

export const StrapiWrapperSchema = z
  .object({
    backgroundColor: StrapiBackgroundColorSchema.nullable(),
    paddingTop: PaddingSchema.nullable(),
    paddingBottom: PaddingSchema.nullable(),
  })
  .strict();

export type StrapiWrapper = z.infer<typeof StrapiWrapperSchema>;
