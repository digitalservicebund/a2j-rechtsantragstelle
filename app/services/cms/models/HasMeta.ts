import { z } from "zod";
import { MetaSchema } from "./Meta";

export const HasMetaSchema = z.object({
  meta: MetaSchema,
});

export type HasMeta = z.infer<typeof HasMetaSchema>;
