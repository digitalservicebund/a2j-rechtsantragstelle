import { z } from "zod";
import { StrapiWrapperSchema } from "./StrapiWrapper";

export const StrapiBackgroundSchema = z
  .object({
    __component: z.literal("meta.background").optional(),
  })
  .merge(StrapiWrapperSchema);

export type StrapiBackground = z.infer<typeof StrapiBackgroundSchema>;
