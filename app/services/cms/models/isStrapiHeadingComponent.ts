import { type z } from "zod";
import { type StrapiHeadingSchema } from "./content/StrapiHeading";
import { type StrapiContentComponent } from "./StrapiContentComponent";

export const isStrapiHeadingComponent = (
  strapiContent: StrapiContentComponent,
): strapiContent is z.infer<typeof StrapiHeadingSchema> =>
  strapiContent.__component === "basic.heading";
