import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { StrapiAutoSuggestInputComponentSchema } from "../components/StrapiAutoSuggestInput";
import { StrapiDateInputComponentSchema } from "../components/StrapiDateInput";
import { StrapiDropdownComponentSchema } from "../components/StrapiDropdown";
import { StrapiInputComponentSchema } from "../components/StrapiInput";
import { StrapiTimeInputComponentSchema } from "../components/StrapiTimeInput";
import { HasStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiImageOptionalSchema } from "../models/StrapiImage";

export const StrapiFieldSetComponentSchema = z
  .object({
    heading: buildRichTextValidation(),
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
  })
  .merge(HasStrapiIdSchema);

export type StrapiFieldSet = z.infer<typeof StrapiFieldSetComponentSchema>;
