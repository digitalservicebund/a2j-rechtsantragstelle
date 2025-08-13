import { type z } from "zod";
import { type StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { type StrapiSelectComponentSchema } from "./formElements/StrapiSelect";

type StrapiSelectComponent = z.infer<typeof StrapiSelectComponentSchema>;

export const isStrapiSelectComponent = (
  strapiContent: StrapiFormComponent,
): strapiContent is StrapiSelectComponent =>
  strapiContent.__component === "form-elements.select";
