import { z } from "zod";
import { StrapiImageOptionalSchema } from "../StrapiImage";
import { StrapiStringOptionalSchema } from "../StrapiStringOptional";

export const StrapiTileSchema = z.object({
  title: z.string(),
  value: z.string(),
  description: StrapiStringOptionalSchema,
  image: StrapiImageOptionalSchema,
  tagDescription: StrapiStringOptionalSchema,
});
