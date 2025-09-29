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
import { StrapiDateSplitInputComponentSchema } from "./StrapiDateSplitInput";

export const StrapiFormComponentSchema = z.union([
  StrapiInputComponentSchema,
  StrapiDateInputComponentSchema,
  StrapiDateSplitInputComponentSchema,
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
