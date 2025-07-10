import { type Renderer } from "marked";
import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { StrapiAutoSuggestInputComponentSchema } from "../components/StrapiAutoSuggestInput";
import { StrapiDateInputComponentSchema } from "../components/StrapiDateInput";
import { StrapiDropdownComponentSchema } from "../components/StrapiDropdown";
import { StrapiInputComponentSchema } from "../components/StrapiInput";
import { StrapiTimeInputComponentSchema } from "../components/StrapiTimeInput";
import { HasStrapiIdSchema } from "../models/HasStrapiId";

const inlineParagraph: Partial<Renderer> = {
  paragraph({ tokens }) {
    return `<p class="md:flex md:gap-8 md:items-center field-set-paragraph">${this.parser?.parseInline(tokens)}</p>`;
  },
};

export const StrapiFieldSetComponentSchema = z
  .object({
    name: z.string(),
    heading: buildRichTextValidation(inlineParagraph),
    fieldSetGroup: z.object({
      formComponents: z
        .array(
          z.union([
            StrapiInputComponentSchema,
            StrapiTimeInputComponentSchema,
            StrapiDropdownComponentSchema,
            StrapiDateInputComponentSchema,
            StrapiAutoSuggestInputComponentSchema,
          ]),
        )
        .nonempty(),
    }),
    __component: z.literal("form-elements.fieldset"),
  })
  .merge(HasStrapiIdSchema);

export type StrapiFieldSet = z.infer<typeof StrapiFieldSetComponentSchema>;
