import { z } from "zod";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { StrapiOptionalIntegerSchema } from "~/services/cms/models/StrapiOptionalInteger";
import { HasStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiOptionalStringSchema } from "../models/StrapiOptionalString";
import { StrapiWidthSchema } from "../models/StrapiWidth";

const DataListSchema = z.enum(["airports", "airlines", "streetNames"]);

export const StrapiAutoSuggestInputComponentSchema = z
  .object({
    name: z.string(),
    label: StrapiOptionalStringSchema,
    placeholder: StrapiOptionalStringSchema,
    errors: StrapiErrorRelationSchema,
    width: StrapiWidthSchema,
    dataList: DataListSchema,
    noSuggestionMessage: StrapiOptionalStringSchema,
    isDisabled: z.boolean().nullable().transform(Boolean),
    minSuggestCharacters: StrapiOptionalIntegerSchema,
    supportsFreeText: z.boolean().nullable().transform(Boolean),
    __component: z.literal("form-elements.auto-suggest-input"),
  })
  .merge(HasStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));

export type DataListType = z.infer<typeof DataListSchema>;
