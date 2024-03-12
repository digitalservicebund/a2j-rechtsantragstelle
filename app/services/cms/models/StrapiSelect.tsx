import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiSelectOptionSchema } from "./StrapiSelectOption";
import RadioGroup from "~/components/inputs/RadioGroup";
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

export const isStrapiSelectComponent = (
  strapiContent: StrapiFormComponent,
): strapiContent is z.infer<typeof StrapiSelectComponentSchema> =>
  strapiContent.__component === "form-elements.select";

export const StrapiSelect = ({ errors, ...props }: StrapiSelect) => {
  return <RadioGroup errorMessages={flattenStrapiErrors(errors)} {...props} />;
};
