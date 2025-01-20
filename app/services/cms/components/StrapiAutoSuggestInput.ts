import { z } from "zod";
import type { AutoSuggestInputProps } from "~/components/inputs/autoSuggestInput/AutoSuggestInput";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

const DataListSchema = z.enum(["airports", "airlines"]);

const StrapiAutoSuggestInputSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    placeholder: z.string().nullable(),
    errors: StrapiErrorRelationSchema,
    width: z
      .enum([
        "characters3",
        "characters5",
        "characters7",
        "characters10",
        "characters16",
        "characters24",
        "characters36",
        "characters54",
      ])
      .nullable(),
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
  width: cmsData.width?.replace(
    "characters",
    "",
  ) as AutoSuggestInputProps["width"],
  errorMessages: flattenStrapiErrors(cmsData.errors),
});
