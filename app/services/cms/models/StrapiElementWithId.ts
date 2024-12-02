import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { StrapiContentComponentSchema } from "./StrapiContentComponent";
import { StrapiInfoBoxItemComponentSchema } from "./StrapiInfoBoxItem";

const elementSchema = StrapiContentComponentSchema.or(
  StrapiInfoBoxItemComponentSchema,
);

export const StrapiElementWithIdSchema = z
  .object({
    elementId: z.string(),
    element: z.array(elementSchema),
  })
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema);

export type StrapiElementWithId = z.infer<typeof StrapiElementWithIdSchema>;

export const isStrapiInfoBoxItem = (
  element: z.infer<typeof elementSchema>,
): element is z.infer<typeof StrapiInfoBoxItemComponentSchema> =>
  element.__component === "page.info-box-item";
