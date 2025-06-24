import { z } from "zod";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import {
  strapiWidthSchema,
  strapiWidthToFieldWidth,
} from "../models/strapiWidth";

export const StrapiInputComponentSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable().transform(omitNull),
    type: z.enum(["text", "number"]),
    placeholder: z.string().nullable().transform(omitNull),
    suffix: z.string().nullable().transform(omitNull),
    errors: StrapiErrorRelationSchema,
    width: strapiWidthSchema.transform(strapiWidthToFieldWidth),
    helperText: z.string().nullable().transform(omitNull),
    __component: z.literal("form-elements.input"),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: flattenStrapiErrors(errors),
  }));
