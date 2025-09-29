import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiStringOptionalSchema } from "../StrapiStringOptional";

export const StrapiDateSplitInputComponentSchema = z
  .object({
    name: z.string(),
    label: StrapiStringOptionalSchema,
    placeholder: StrapiStringOptionalSchema,
    errors: StrapiErrorRelationSchema,
    __component: z.literal("form-elements.date-split-input"),
    ...HasStrapiIdSchema.shape,
  })
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
