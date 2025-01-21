import { z } from "zod";
import { RadioGroupProps } from "~/components/inputs/RadioGroup";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiSelectOptionSchema } from "../models/StrapiSelectOption";

const StrapiSelectSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    altLabel: z.string().nullable(),
    options: z.array(StrapiSelectOptionSchema),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiSelect = z.infer<typeof StrapiSelectSchema>;

export const StrapiSelectComponentSchema = StrapiSelectSchema.extend({
  __component: z.literal("form-elements.select"),
});

type StrapiSelectComponent = z.infer<typeof StrapiSelectComponentSchema>;
export const isStrapiSelectComponent = (
  strapiContent: StrapiFormComponent,
): strapiContent is StrapiSelectComponent =>
  strapiContent.__component === "form-elements.select";

/**
 * A Strapi "select" is really just a Radio Group
 */
export const getRadioGroupProps = (cmsData: StrapiSelect): RadioGroupProps => ({
  ...omitNull(cmsData),
  errorMessages: flattenStrapiErrors(cmsData.errors),
});
