import { z } from "zod";
import { HasStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiErrorRelationSchema } from "../models/StrapiErrorRelationSchema";
import { StrapiOptionalStringSchema } from "../models/StrapiOptionalString";
import { StrapiTileSchema } from "../models/StrapiTile";

export const StrapiTileGroupComponentSchema = z
  .object({
    __component: z.literal("form-elements.tile-group"),
    name: z.string(),
    label: StrapiOptionalStringSchema,
    altLabel: StrapiOptionalStringSchema,
    options: z.array(StrapiTileSchema),
    errors: StrapiErrorRelationSchema,
    useTwoColumns: z.boolean(),
  })
  .merge(HasStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
