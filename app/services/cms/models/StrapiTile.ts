import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiImageSchema } from "./StrapiImage";

export const StrapiTileSchema = z
  .object({
    text: z.string(),
    value: z.string(),
    description: z.string().nullable(),
    image: StrapiImageSchema.optional(),
  })
  .merge(HasOptionalStrapiIdSchema);
