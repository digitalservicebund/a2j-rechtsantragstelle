import { z } from "zod";
import { BackgroundColorSchema } from "./BackgroundColor";
import { PaddingSchema } from "./Padding";

export const StrapiWrapperSchema = z
  .object({
    backgroundColor: BackgroundColorSchema.nullable(),
    paddingTop: PaddingSchema.nullable(),
    paddingBottom: PaddingSchema.nullable(),
  })
  .strict();

export type StrapiWrapper = z.infer<typeof StrapiWrapperSchema>;
