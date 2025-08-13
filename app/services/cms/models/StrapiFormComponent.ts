import { z } from "zod";
import { StrapiAutoSuggestInputComponentSchema } from "./formElements/StrapiAutoSuggestInput";
import { StrapiCheckboxComponentSchema } from "./formElements/StrapiCheckbox";
import { StrapiDateInputComponentSchema } from "./formElements/StrapiDateInput";
import { StrapiDropdownComponentSchema } from "./formElements/StrapiDropdown";
import { StrapiFieldSetComponentSchema } from "./formElements/StrapiFieldSet";
import { StrapiFilesUploadComponentSchema } from "./formElements/StrapiFilesUpload";
import { StrapiHiddenInputComponentSchema } from "./formElements/StrapiHiddenInput";
import { StrapiInputComponentSchema } from "./formElements/StrapiInput";
import { StrapiSelectComponentSchema } from "./formElements/StrapiSelect";
import { StrapiTextareaComponentSchema } from "./formElements/StrapiTextarea";
import { StrapiTileGroupComponentSchema } from "./formElements/StrapiTileGroup";
import { StrapiTimeInputComponentSchema } from "./formElements/StrapiTimeInput";

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
