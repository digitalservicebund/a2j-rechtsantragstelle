import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import type { StrapiContentComponent } from "./StrapiContentComponent";

export const HeadingPropsSchema = z
  .object({
    tagName: z
      .enum(["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"])
      .optional(),
    text: z.string().optional(),
    look: z.string().optional(),
    className: z.string().optional(),
    dataTestid: z.string().optional(),
    tagId: z.string().optional(),
  })
  .readonly();

export const StrapiHeadingSchema = z
  .object({
    text: z.string(),
    tagName: z.enum(["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"]),
    look: z.enum([
      "default",
      "ds-heading-01-reg",
      "ds-heading-02-reg",
      "ds-heading-03-reg",
      "ds-heading-03-bold",
      "ds-subhead",
      "ds-label-01-reg",
      "ds-label-01-bold",
      "ds-label-02-reg",
      "ds-label-02-bold",
      "ds-label-03-reg",
      "ds-label-03-bold",
      "ds-label-section",
      "ds-body-01-reg",
      "ds-body-02-reg",
    ]),
  })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiHeadingComponentSchema = StrapiHeadingSchema.extend({
  __component: z.literal("basic.heading"),
});

type StrapiHeading = z.infer<typeof StrapiHeadingSchema>;

export function getHeadingProps(cmsData: StrapiHeading | null) {
  if (!cmsData) return undefined;
  return HeadingPropsSchema.parse(omitNull(cmsData));
}

export const isStrapiHeadingComponent = (
  strapiContent: StrapiContentComponent,
): strapiContent is z.infer<typeof StrapiHeadingComponentSchema> =>
  strapiContent.__component === "basic.heading";
