import { z } from "zod";
import { type CookieBannerContentProps } from "~/components/cookieBanner/CookieBanner";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { getRichTextProps, StrapiParagraphSchema } from "./StrapiParagraph";

export const StrapiCookieBannerSchema = z
  .object({
    heading: StrapiHeadingSchema,
    paragraphs: z.array(StrapiParagraphSchema),
    acceptButtonLabel: z.string(),
    declineButtonLabel: z.string(),
    cookieSettingLinkText: z.string().nullable(),
    cookieSettingLinkUrl: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema);

type StrapiCookieBanner = z.infer<typeof StrapiCookieBannerSchema>;

export const getCookieBannerProps = (
  cmsData: StrapiCookieBanner,
): CookieBannerContentProps => {
  return {
    heading: getRichTextProps(cmsData.heading),
    paragraphs: cmsData.paragraphs.map((p) => getRichTextProps(p)),
    acceptButtonLabel: cmsData.acceptButtonLabel,
    declineButtonLabel: cmsData.declineButtonLabel,
    // TODO: mark both fields as required in strapi
    cookieSettingLinkText: cmsData.cookieSettingLinkText ?? "",
    cookieSettingLinkUrl: cmsData.cookieSettingLinkUrl ?? "",
  };
};
