import { z } from "zod";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiErrorRelationSchema } from "../StrapiErrorRelationSchema";
import { StrapiStringOptionalSchema } from "../StrapiStringOptional";
import { StrapiTileSchema } from "../StrapiTile";

export const StrapiTileGroupComponentSchema = z
  .object({
    __component: z.literal("form-elements.tile-group"),
    name: z.string(),
    label: StrapiStringOptionalSchema,
    altLabel: StrapiStringOptionalSchema,
    options: z.array(StrapiTileSchema),
    errors: StrapiErrorRelationSchema,
    useTwoColumns: z.boolean(),
    ...HasStrapiIdSchema.shape,
  })
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
