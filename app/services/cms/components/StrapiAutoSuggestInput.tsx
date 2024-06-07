import { z } from "zod";
import SuggestionInput from "~/components/inputs/suggestionInput/SuggestionInput";
import type { SuggestionInputProps } from "~/components/inputs/suggestionInput/SuggestionInput";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

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
    dataList: z.enum(["airports"]).nullable(),
    noSuggestionMessage: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiAutoSuggestInput = z.infer<typeof StrapiAutoSuggestInputSchema>;

export const StrapiAutoSuggestInputComponentSchema =
  StrapiAutoSuggestInputSchema.extend({
    __component: z.literal("form-elements.auto-suggest-input"),
  });

const StrapiAutoSuggestInput = ({
  errors,
  width,
  ...props
}: StrapiAutoSuggestInput) => {
  const inWidth = width?.replace(
    "characters",
    "",
  ) as SuggestionInputProps["width"];
  const errorMessages = flattenStrapiErrors(errors);
  return (
    <SuggestionInput
      {...omitNull(props)}
      width={inWidth}
      errorMessages={errorMessages}
    />
  );
};

export default StrapiAutoSuggestInput;
