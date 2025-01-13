import { z } from "zod";
import { HiddenInputProps } from "~/components/inputs/HiddenInput";
import { HasOptionalStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { omitNull } from "~/util/omitNull";

const StrapiHiddenInputSchema = z
  .object({
    name: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiHiddenInput = z.infer<typeof StrapiHiddenInputSchema>;

export const StrapiHiddenInputComponentSchema = StrapiHiddenInputSchema.extend({
  __component: z.literal("form-elements.hidden-input"),
});

export const getHiddenInputProps = (
  cmsData: StrapiHiddenInput,
): HiddenInputProps => ({ ...omitNull(cmsData) });
