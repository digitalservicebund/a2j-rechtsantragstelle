import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { StrapiDateInputComponentSchema } from "../components/StrapiDateInput";
import { StrapiDropdownComponentSchema } from "../components/StrapiDropdown";
import { StrapiInputComponentSchema } from "../components/StrapiInput";
import { StrapiTimeInputComponentSchema } from "../components/StrapiTimeInput";

export const StrapiFieldsetGroupsSchema = z
  .object({
    name: z.string(),
    formComponents: z.array(
      StrapiInputComponentSchema ||
        StrapiTimeInputComponentSchema ||
        StrapiDateInputComponentSchema ||
        StrapiDropdownComponentSchema,
    ),
  })
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema);

export type StrapiFieldsetGroups = z.infer<typeof StrapiFieldsetGroupsSchema>;
