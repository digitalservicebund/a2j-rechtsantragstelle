import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema } from "./StrapiParagraph";

export const StrapiCookieBannerSchema = z
  .object({
    heading: StrapiHeadingSchema,
    paragraphs: z.array(StrapiParagraphSchema),
    acceptButtonLabel: z.string(),
    declineButtonLabel: z.string(),
    cookieSettingLinkText: z.string(),
    cookieSettingLinkUrl: z.string(),
  })
  .merge(HasStrapiLocaleSchema);
