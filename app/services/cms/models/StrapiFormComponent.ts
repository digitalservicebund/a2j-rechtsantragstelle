import { z } from "zod";
import { StrapiInputComponentSchema } from "./StrapiInput";
import { StrapiSelectComponentSchema } from "./StrapiSelect";
import { StrapiDropdownComponentSchema } from "./StrapiDropdown";
import { StrapiTextareaComponentSchema } from "./StrapiTextarea";
import { StrapiCheckboxComponentSchema } from "./StrapiCheckbox";
import { StrapiTileGroupComponentSchema } from "./StrapiTileGroup";
import { StrapiDateInputComponentSchema } from "~/services/cms/models/StrapiDateInput";
import { StrapiTimeInputComponentSchema } from "~/services/cms/models/StrapiTimeInput";
import { StrapiFileInputComponentSchema } from "~/services/cms/models/StrapiFileInput";

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
