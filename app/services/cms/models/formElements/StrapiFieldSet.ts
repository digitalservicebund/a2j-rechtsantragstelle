import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { StrapiAutoSuggestInputComponentSchema } from "./StrapiAutoSuggestInput";
import { StrapiDateInputComponentSchema } from "./StrapiDateInput";
import { StrapiDropdownComponentSchema } from "./StrapiDropdown";
import { StrapiInputComponentSchema } from "./StrapiInput";
import { StrapiTimeInputComponentSchema } from "./StrapiTimeInput";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiImageOptionalSchema } from "../StrapiImage";

export const StrapiFieldSetComponentSchema = z.object({
  heading: buildRichTextValidation({
    paragraph({ tokens }) {
      return `<p class="ds-subhead">${this.parser?.parseInline(tokens)}</p>`;
    },
  }),
  image: StrapiImageOptionalSchema,
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
  ...HasStrapiIdSchema.shape,
});

export type StrapiFieldSet = z.infer<typeof StrapiFieldSetComponentSchema>;
