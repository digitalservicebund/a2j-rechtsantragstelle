import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiErrorRelationSchema } from "../models/StrapiErrorRelationSchema";
import { strapiOptionalStringSchema } from "../models/strapiOptionalString";
import { StrapiTileSchema } from "../models/StrapiTile";

export const StrapiTileGroupComponentSchema = z
  .object({
    __component: z.literal("form-elements.tile-group"),
    name: z.string(),
    label: strapiOptionalStringSchema,
    altLabel: strapiOptionalStringSchema,
    options: z.array(StrapiTileSchema),
    errors: StrapiErrorRelationSchema,
    useTwoColumns: z.boolean(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
