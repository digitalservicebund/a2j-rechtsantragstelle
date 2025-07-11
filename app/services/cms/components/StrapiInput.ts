import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiOptionalStringSchema } from "../models/StrapiOptionalString";
import { StrapiWidthSchema } from "../models/StrapiWidth";

export const StrapiInputComponentSchema = z
  .object({
    name: z.string(),
    label: StrapiOptionalStringSchema,
    type: z.enum(["text", "number"]),
    placeholder: StrapiOptionalStringSchema,
    suffix: StrapiOptionalStringSchema,
    errors: StrapiErrorRelationSchema,
    width: StrapiWidthSchema,
    helperText: StrapiOptionalStringSchema,
    __component: z.literal("form-elements.input"),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));

export type StrapiInputComponent = z.input<typeof StrapiInputComponentSchema>;
