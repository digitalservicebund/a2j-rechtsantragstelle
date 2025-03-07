import { z } from "zod";
import type { AutoSuggestInputProps } from "~/components/inputs/autoSuggestInput/AutoSuggestInput";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import {
  strapiWidthToFieldWidth,
  strapiWidthSchema,
} from "../models/strapiWidth";

const DataListSchema = z.enum(["airports", "airlines"]);

const StrapiAutoSuggestInputSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    placeholder: z.string().nullable(),
    errors: StrapiErrorRelationSchema,
    width: strapiWidthSchema.nullable(),
    dataList: DataListSchema,
    noSuggestionMessage: z.string().nullable(),
    isDisabled: z
      .boolean()
      .nullable()
      .transform((value) => {
        if (value === null) {
          return false;
        }

        return value;
      }),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiAutoSuggestInput = z.infer<typeof StrapiAutoSuggestInputSchema>;

export type DataListType = z.infer<typeof DataListSchema>;

export const StrapiAutoSuggestInputComponentSchema =
  StrapiAutoSuggestInputSchema.extend({
    __component: z.literal("form-elements.auto-suggest-input"),
  });

export const getAutoSuggestInputProps = (
  cmsData: StrapiAutoSuggestInput,
): AutoSuggestInputProps => ({
  ...omitNull(cmsData),
  width: strapiWidthToFieldWidth(cmsData.width),
  errorMessages: flattenStrapiErrors(cmsData.errors),
});
