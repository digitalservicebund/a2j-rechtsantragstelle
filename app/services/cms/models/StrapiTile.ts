import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiImageOptionalSchema } from "./StrapiImage";

export const StrapiTileSchema = z
  .object({
    title: z.string(),
    value: z.string(),
    description: z.string().nullable().transform(omitNull),
    image: StrapiImageOptionalSchema,
    tagDescription: z.string().nullable().transform(omitNull),
  })
  .merge(HasOptionalStrapiIdSchema);
