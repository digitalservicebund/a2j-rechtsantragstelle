import { z } from "zod";
import { StrapiImageOptionalSchema } from "./StrapiImage";
import { StrapiOptionalStringSchema } from "./StrapiOptionalString";

export const StrapiTileSchema = z.object({
  title: z.string(),
  value: z.string(),
  description: StrapiOptionalStringSchema,
  image: StrapiImageOptionalSchema,
  tagDescription: StrapiOptionalStringSchema,
});
