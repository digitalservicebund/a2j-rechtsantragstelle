import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import {
  HasOptionalStrapiIdSchema,
  HasStrapiIdSchema,
} from "../models/HasStrapiId";
import { StrapiErrorCategorySchema } from "../models/StrapiErrorCategory";
import { StrapiTileSchema } from "../models/StrapiTile";

export const StrapiTileGroupComponentSchema = z
  .object({
    __component: z.literal("form-elements.tile-group"),
    name: z.string(),
    label: z.string().nullable().transform(omitNull),
    altLabel: z.string().nullable().transform(omitNull),
    options: z.array(StrapiTileSchema),
    errors: z.array(StrapiErrorCategorySchema.merge(HasStrapiIdSchema)),
    useTwoColumns: z.boolean(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors?.flatMap((cmsError) => cmsError.errorCodes),
  }));
