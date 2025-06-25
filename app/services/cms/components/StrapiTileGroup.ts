import { z } from "zod";
import {
  HasOptionalStrapiIdSchema,
  HasStrapiIdSchema,
} from "../models/HasStrapiId";
import { StrapiErrorCategorySchema } from "../models/StrapiErrorCategory";
import { strapiOptionalStringSchema } from "../models/strapiOptionalString";
import { StrapiTileSchema } from "../models/StrapiTile";

export const StrapiTileGroupComponentSchema = z
  .object({
    __component: z.literal("form-elements.tile-group"),
    name: z.string(),
    label: strapiOptionalStringSchema,
    altLabel: strapiOptionalStringSchema,
    options: z.array(StrapiTileSchema),
    errors: z.array(StrapiErrorCategorySchema.merge(HasStrapiIdSchema)),
    useTwoColumns: z.boolean(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors?.flatMap((cmsError) => cmsError.errorCodes),
  }));
