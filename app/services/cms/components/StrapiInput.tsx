import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
//import Input, { type InputProps } from "~/components/inputs/Input";
import SuggestionInput, {
  type SuggestionInputProps,
} from "~/components/inputs/SuggestionInput";
import { omitNull } from "~/util/omitNull";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";

const StrapiInputSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    type: z.enum(["text", "number"]),
    placeholder: z.string().nullable(),
    suffix: z.string().nullable(),
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
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiInput = z.infer<typeof StrapiInputSchema>;

export const StrapiInputComponentSchema = StrapiInputSchema.extend({
  __component: z.literal("form-elements.input"),
});

export const StrapiInput = ({ errors, width, ...props }: StrapiInput) => {
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
