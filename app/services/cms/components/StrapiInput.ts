import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { HasStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiStringOptionalSchema } from "../models/StrapiStringOptional";
import { StrapiWidthSchema } from "../models/StrapiWidth";

export const StrapiInputComponentSchema = z
  .object({
    name: z.string(),
    label: StrapiStringOptionalSchema,
    type: z.enum(["text", "number"]),
    placeholder: StrapiStringOptionalSchema,
    suffix: StrapiStringOptionalSchema,
    errors: StrapiErrorRelationSchema,
    width: StrapiWidthSchema,
    helperText: StrapiStringOptionalSchema,
    __component: z.literal("form-elements.input"),
    ...HasStrapiIdSchema.shape,
  })
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));

export type StrapiInputComponent = z.input<typeof StrapiInputComponentSchema>;
