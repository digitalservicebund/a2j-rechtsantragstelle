import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiWrapperSchema } from "./StrapiWrapper";

export const StrapiBackgroundSchema = z
  .object({
    __component: z.literal("meta.background").optional(),
  })
  .merge(StrapiWrapperSchema)
  .merge(HasOptionalStrapiIdSchema);

export type StrapiBackground = z.infer<typeof StrapiBackgroundSchema>;
