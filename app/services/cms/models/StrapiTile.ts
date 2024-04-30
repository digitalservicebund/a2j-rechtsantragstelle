import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiImageSchema } from "./StrapiImage";

export const StrapiTileSchema = z
  .object({
    title: z.string(),
    value: z.string(),
    description: z.string().nullable(),
    image: StrapiImageSchema.nullable(),
    tagDescription: z.string().optional().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);
