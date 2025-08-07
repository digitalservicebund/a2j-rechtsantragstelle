import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { StrapiOptionalIntegerSchema } from "~/services/cms/models/StrapiOptionalInteger";
import { HasStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiStringOptionalSchema } from "../models/StrapiStringOptional";
import { StrapiWidthSchema } from "../models/StrapiWidth";

const DataListSchema = z.enum(["airports", "airlines", "streetNames"]);

export const StrapiAutoSuggestInputComponentSchema = z
  .object({
    name: z.string(),
    label: StrapiStringOptionalSchema,
    placeholder: StrapiStringOptionalSchema,
    errors: StrapiErrorRelationSchema,
    width: StrapiWidthSchema,
    dataList: DataListSchema,
    noSuggestionMessage: StrapiStringOptionalSchema,
    isDisabled: z.boolean().nullable().transform(Boolean),
    minSuggestCharacters: StrapiOptionalIntegerSchema,
    supportsFreeText: z.boolean().nullable().transform(Boolean),
    __component: z.literal("form-elements.auto-suggest-input"),
    ...HasStrapiIdSchema.shape,
  })
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));

export type DataListType = z.infer<typeof DataListSchema>;
