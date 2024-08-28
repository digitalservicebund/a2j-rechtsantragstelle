import { z } from "zod";
import HiddenInput from "~/components/inputs/HiddenInput";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

const StrapiHiddenInputSchema = z
  .object({
    name: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiHiddenInput = z.infer<typeof StrapiHiddenInputSchema>;

export const StrapiHiddenInputComponentSchema = StrapiHiddenInputSchema.extend({
  __component: z.literal("form-elements.hidden-input"),
});

export const StrapiHiddenInput = ({ ...props }: StrapiHiddenInput) => {
  return <HiddenInput {...omitNull(props)} />;
};
