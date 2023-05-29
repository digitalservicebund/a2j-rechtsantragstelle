import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiWrapperSchema } from "./StrapiWrapper";

export const StrapiBackgroundSchema = z
  .object({
    id: z.number(),
    __component: z.literal("meta.background").optional(),
  })
  .merge(StrapiWrapperSchema)
  .merge(HasStrapiIdSchema)
  .strict();

export type StrapiBackground = z.infer<typeof StrapiBackgroundSchema>;
