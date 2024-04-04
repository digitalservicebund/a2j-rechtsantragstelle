import { z } from "zod";
import { StrapiInputComponentSchema } from "../components/StrapiInput";
import { StrapiSelectComponentSchema } from "../components/StrapiSelect";
import { StrapiDropdownComponentSchema } from "../components/StrapiDropdown";
import { StrapiTextareaComponentSchema } from "../components/StrapiTextarea";
import { StrapiCheckboxComponentSchema } from "../components/StrapiCheckbox";
import { StrapiTileGroupComponentSchema } from "../components/StrapiTileGroup";
import { StrapiDateInputComponentSchema } from "../components/StrapiDateInput";
import { StrapiTimeInputComponentSchema } from "../components/StrapiTimeInput";
import { StrapiFileInputComponentSchema } from "../components/StrapiFileInput";

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
]);

export type StrapiFormComponent = z.infer<typeof StrapiFormComponentSchema>;
