import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import {
  strapiWidthToFieldWidth,
  strapiWidthSchema,
} from "../models/strapiWidth";

const DataListSchema = z.enum(["airports", "airlines"]);

export const StrapiAutoSuggestInputComponentSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable().transform(omitNull),
    placeholder: z.string().nullable().transform(omitNull),
    errors: StrapiErrorRelationSchema,
    width: strapiWidthSchema.nullable().transform(strapiWidthToFieldWidth),
    dataList: DataListSchema,
    noSuggestionMessage: z.string().nullable().transform(omitNull),
    isDisabled: z.boolean().nullable().transform(Boolean),
    __component: z.literal("form-elements.auto-suggest-input"),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));

export type DataListType = z.infer<typeof DataListSchema>;
