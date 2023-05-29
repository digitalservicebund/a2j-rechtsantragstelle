import { z } from "zod";
import { StrapiMetaSchema } from "./StrapiMeta";

export const HasStrapiMetaSchema = z.object({
  meta: StrapiMetaSchema,
});

export type HasStrapiMeta = z.infer<typeof HasStrapiMetaSchema>;
