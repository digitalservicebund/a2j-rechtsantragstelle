import { z } from "zod";
import { StrapiAutoSuggestInputComponentSchema } from "../components/StrapiAutoSuggestInput";
import { StrapiDateInputComponentSchema } from "../components/StrapiDateInput";
import { StrapiDropdownComponentSchema } from "../components/StrapiDropdown";
import { StrapiInputComponentSchema } from "../components/StrapiInput";
import { StrapiTimeInputComponentSchema } from "../components/StrapiTimeInput";

export const StrapiFieldSetGroupsSchema = z.object({
  formComponents: z.array(
    z.union([
      StrapiInputComponentSchema,
      StrapiTimeInputComponentSchema,
      StrapiDropdownComponentSchema,
      StrapiDateInputComponentSchema,
      StrapiAutoSuggestInputComponentSchema,
    ]),
  ),
});

export type StrapiFieldSetGroups = z.infer<typeof StrapiFieldSetGroupsSchema>;
