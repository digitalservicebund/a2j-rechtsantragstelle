import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiImageOptionalSchema } from "../StrapiImage";
import { StrapiStringOptionalSchema } from "../StrapiStringOptional";
import { StrapiAutoSuggestInputComponentSchema } from "./StrapiAutoSuggestInput";
import { StrapiDateInputComponentSchema } from "./StrapiDateInput";
import { StrapiDropdownComponentSchema } from "./StrapiDropdown";
import { StrapiInputComponentSchema } from "./StrapiInput";
import { StrapiTextareaComponentSchema } from "./StrapiTextarea";
import { StrapiTimeInputComponentSchema } from "./StrapiTimeInput";

export const StrapiFieldSetComponentSchema = z.object({
  heading: buildRichTextValidation({
    paragraph({ tokens }) {
      return `<p>${this.parser?.parseInline(tokens)}</p>`;
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
          StrapiTextareaComponentSchema,
        ]),
      )
      .nonempty(),
  }),
  __component: z.literal("form-elements.fieldset"),
  helperText: StrapiStringOptionalSchema,
  suffix: StrapiStringOptionalSchema,
  ...HasStrapiIdSchema.shape,
});

export type StrapiFieldSet = z.infer<typeof StrapiFieldSetComponentSchema>;
