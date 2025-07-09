import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiFieldSetGroupsSchema } from "../models/StrapiFieldSetGroups";

export const StrapiFieldSetComponentSchema = z
  .object({
    name: z.string(),
    heading: buildRichTextValidation(),
    fieldSetGroup: z.object({
      data: HasStrapiIdSchema.extend({
        attributes: StrapiFieldSetGroupsSchema,
      }),
    }),
    __component: z.literal("form-elements.fieldset"),
  })
  .merge(HasStrapiIdSchema);

export type StrapiFieldSet = z.infer<typeof StrapiFieldSetComponentSchema>;
