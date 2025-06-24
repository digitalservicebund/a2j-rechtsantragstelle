import { z } from "zod";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

export const StrapiDateInputComponentSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable().transform(omitNull),
    placeholder: z.string().nullable().transform(omitNull),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: flattenStrapiErrors(errors),
    __component: "form-elements.date-input" as const,
  }));
