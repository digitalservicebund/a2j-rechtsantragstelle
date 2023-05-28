import { z } from "zod";
import { HasIdSchema } from "./HasId";
import { StrapiWrapperSchema } from "./StrapiWrapper";

export const StrapiBackgroundSchema = z
  .object({
    id: z.number(),
    __component: z.literal("meta.background").optional(),
  })
  .merge(StrapiWrapperSchema)
  .merge(HasIdSchema)
  .strict();

export type StrapiBackground = z.infer<typeof StrapiBackgroundSchema>;
