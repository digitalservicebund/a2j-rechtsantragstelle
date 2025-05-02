import { type z } from "zod";
import { type StrapiContentComponent } from "./StrapiContentComponent";
import { type StrapiHeaderSchema } from "./StrapiHeader";

type StrapiHeaderComponent = z.infer<typeof StrapiHeaderSchema>;

export const isStrapiHeader = (
  content: StrapiContentComponent,
): content is StrapiHeaderComponent => content.__component === "page.header";
