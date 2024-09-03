import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { StrapiDateInputComponentSchema } from "../components/StrapiDateInput";
import { StrapiDropdownComponentSchema } from "../components/StrapiDropdown";
import { StrapiInputComponentSchema } from "../components/StrapiInput";
import { StrapiTimeInputComponentSchema } from "../components/StrapiTimeInput";

export const StrapiFieldsetGroupsFormComponentsSchema = z.discriminatedUnion(
  "__component",
  [
    StrapiInputComponentSchema,
    StrapiTimeInputComponentSchema,
    StrapiDropdownComponentSchema,
    StrapiDateInputComponentSchema,
  ],
);

export const StrapiFieldsetGroupsSchema = z
  .object({
    name: z.string(),
    formComponents: z.array(StrapiFieldsetGroupsFormComponentsSchema),
  })
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema);

export type StrapiFieldsetGroups = z.infer<typeof StrapiFieldsetGroupsSchema>;
