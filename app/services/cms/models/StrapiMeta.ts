import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";

export const StrapiMetaSchema = z
  .object({
    title: z.string(),
  })
  .merge(HasStrapiIdSchema)
  .strict();

export type StrapiMeta = z.infer<typeof StrapiMetaSchema>;
