import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiStringOptionalSchema } from "../StrapiStringOptional";
import { StrapiSize } from "../StrapiInputSize";

export const StrapiInputComponentSchema = z
  .object({
    name: z.string(),
    label: StrapiStringOptionalSchema,
    type: z.enum(["text", "number"]),
    placeholder: StrapiStringOptionalSchema,
    suffix: StrapiStringOptionalSchema,
    errors: StrapiErrorRelationSchema,
    helperText: StrapiStringOptionalSchema,
    size: StrapiSize,
    __component: z.literal("form-elements.input"),
    ...HasStrapiIdSchema.shape,
  })
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
