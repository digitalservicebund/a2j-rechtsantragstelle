import { z } from "zod";
import { StrapiAutoSuggestInputComponentSchema } from "./StrapiAutoSuggestInput";
import { StrapiCheckboxComponentSchema } from "./StrapiCheckbox";
import { StrapiDateInputComponentSchema } from "./StrapiDateInput";
import { StrapiDropdownComponentSchema } from "./StrapiDropdown";
import { StrapiFieldSetComponentSchema } from "./StrapiFieldSet";
import { StrapiFilesUploadComponentSchema } from "./StrapiFilesUpload";
import { StrapiHiddenInputComponentSchema } from "./StrapiHiddenInput";
import { StrapiInputComponentSchema } from "./StrapiInput";
import { StrapiSelectComponentSchema } from "./StrapiSelect";
import { StrapiTextareaComponentSchema } from "./StrapiTextarea";
import { StrapiTileGroupComponentSchema } from "./StrapiTileGroup";
import { StrapiTimeInputComponentSchema } from "./StrapiTimeInput";

export const StrapiFormComponentSchema = z.union([
  StrapiInputComponentSchema,
  StrapiDateInputComponentSchema,
  StrapiTimeInputComponentSchema,
  StrapiFilesUploadComponentSchema,
  StrapiTextareaComponentSchema,
  StrapiSelectComponentSchema,
  StrapiDropdownComponentSchema,
  StrapiCheckboxComponentSchema,
  StrapiTileGroupComponentSchema,
  StrapiAutoSuggestInputComponentSchema,
  StrapiHiddenInputComponentSchema,
  StrapiFieldSetComponentSchema,
]);

export type StrapiFormComponent = z.infer<typeof StrapiFormComponentSchema>;
export type StrapiFormComponentInput = z.input<
  typeof StrapiFormComponentSchema
>;
