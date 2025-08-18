import { z } from "zod";
import { StrapiHeadingSchema } from "./content/StrapiHeading";
import { StrapiParagraphSchema } from "./content/StrapiParagraph";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";

export const StrapiCookieBannerSchema = z.object({
  heading: StrapiHeadingSchema,
  paragraphs: z.array(StrapiParagraphSchema),
  acceptButtonLabel: z.string(),
  declineButtonLabel: z.string(),
  cookieSettingLinkText: z.string(),
  cookieSettingLinkUrl: z.string(),
  ...HasStrapiLocaleSchema.shape,
});
