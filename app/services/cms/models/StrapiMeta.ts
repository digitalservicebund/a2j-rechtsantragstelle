import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiMetaSchema = z
  .object({ title: z.string() })
  .merge(HasOptionalStrapiIdSchema);
