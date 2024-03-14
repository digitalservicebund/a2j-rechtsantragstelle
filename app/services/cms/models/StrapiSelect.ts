import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiSelectOptionSchema } from "./StrapiSelectOption";
import { RadioGroupPropsSchema } from "~/components/inputs/RadioGroup";
import { omitNull } from "~/util/omitNull";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import type { StrapiFormComponent } from "./StrapiFormComponent";

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

export const getRadioGroupProps = (cmsData: StrapiSelect) => {
  const errorMessages = flattenStrapiErrors(cmsData.errors);
  return RadioGroupPropsSchema.parse(omitNull({ ...cmsData, errorMessages }));
};

export const isStrapiSelectComponent = (
  strapiContent: StrapiFormComponent,
): strapiContent is z.infer<typeof StrapiSelectComponentSchema> =>
  strapiContent.__component === "form-elements.select";
