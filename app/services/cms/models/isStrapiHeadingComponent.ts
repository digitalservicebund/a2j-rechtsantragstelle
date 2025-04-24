import { type z } from "zod";
import { type StrapiContentComponent } from "./StrapiContentComponent";
import { type StrapiHeadingSchema } from "./StrapiHeading";

export const isStrapiHeadingComponent = (
  strapiContent: StrapiContentComponent,
): strapiContent is z.infer<typeof StrapiHeadingSchema> =>
  strapiContent.__component === "basic.heading";
