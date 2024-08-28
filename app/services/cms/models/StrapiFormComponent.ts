import { z } from "zod";
import { StrapiAutoSuggestInputComponentSchema } from "../components/StrapiAutoSuggestInput";
import { StrapiCheckboxComponentSchema } from "../components/StrapiCheckbox";
import { StrapiDateInputComponentSchema } from "../components/StrapiDateInput";
import { StrapiDropdownComponentSchema } from "../components/StrapiDropdown";
import { StrapiFileInputComponentSchema } from "../components/StrapiFileInput";
import { StrapiHiddenInputComponentSchema } from "../components/StrapiHiddenInput";
import { StrapiInputComponentSchema } from "../components/StrapiInput";
import { StrapiSelectComponentSchema } from "../components/StrapiSelect";
import { StrapiTextareaComponentSchema } from "../components/StrapiTextarea";
import { StrapiTileGroupComponentSchema } from "../components/StrapiTileGroup";
import { StrapiTimeInputComponentSchema } from "../components/StrapiTimeInput";

export const StrapiFormComponentSchema = z.discriminatedUnion("__component", [
  StrapiInputComponentSchema,
  StrapiDateInputComponentSchema,
  StrapiTimeInputComponentSchema,
  StrapiFileInputComponentSchema,
  StrapiTextareaComponentSchema,
  StrapiSelectComponentSchema,
  StrapiDropdownComponentSchema,
  StrapiCheckboxComponentSchema,
  StrapiTileGroupComponentSchema,
  StrapiAutoSuggestInputComponentSchema,
  StrapiHiddenInputComponentSchema,
]);

export type StrapiFormComponent = z.infer<typeof StrapiFormComponentSchema>;
