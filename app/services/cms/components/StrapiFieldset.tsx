import { z } from "zod";
import { Fieldset } from "~/components/inputs/Filedset";
import {
  HasOptionalStrapiIdSchema,
  HasStrapiIdSchema,
} from "../models/HasStrapiId";
import { StrapiFieldsetGroupsSchema } from "../models/StrapiFieldsetGroups";

const StrapiFieldsetSchema = z
  .object({
    name: z.string(),
    heading: z.string(),
    fieldsetGroup: z.object({
      data: HasStrapiIdSchema.extend({
        attributes: StrapiFieldsetGroupsSchema,
      }),
    }),
  })
  .merge(HasOptionalStrapiIdSchema);

export type StrapiFieldset = z.infer<typeof StrapiFieldsetSchema>;

export const StrapiFieldsetComponentSchema = StrapiFieldsetSchema.extend({
  __component: z.literal("form-elements.fieldset"),
});

export const StrapiFieldset = ({
  heading,
  fieldsetGroup: {
    data: {
      attributes: { formComponents },
    },
  },
}: StrapiFieldset) => {
  return <Fieldset heading={heading} formComponents={formComponents} />;
};
