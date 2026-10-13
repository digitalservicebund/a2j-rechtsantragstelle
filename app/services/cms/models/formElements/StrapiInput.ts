import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiStringOptionalSchema } from "../StrapiStringOptional";

export const StrapiInputComponentSchema = z
  .object({
    name: z.string(),
    label: StrapiStringOptionalSchema,
    type: z.enum(["text", "number"]),
    placeholder: StrapiStringOptionalSchema,
    suffix: StrapiStringOptionalSchema,
    errors: StrapiErrorRelationSchema,
    helperText: StrapiStringOptionalSchema,
    __component: z.literal("form-elements.input"),
    ...HasStrapiIdSchema.shape,
  })
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
