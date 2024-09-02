import { z } from "zod";
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
      }).nullable(),
    }),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiFieldset = z.infer<typeof StrapiFieldsetSchema>;

export const StrapiFieldsetComponentSchema = StrapiFieldsetSchema.extend({
  __component: z.literal("form-elements.fieldset"),
});

export const StrapiFieldset = ({ ...props }: StrapiFieldset) => {
  return <div />;
};
