import { z } from "zod";
import { type CookieBannerContentProps } from "~/components/cookieBanner/CookieBanner";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { getHeadingProps, StrapiHeadingSchema } from "./StrapiHeading";
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

type StrapiCookieBanner = z.infer<typeof StrapiCookieBannerSchema>;

export const getCookieBannerProps = (
  cmsData: StrapiCookieBanner,
): CookieBannerContentProps => {
  return {
    heading: getHeadingProps(cmsData.heading)!,
    paragraphs: cmsData.paragraphs,
    acceptButtonLabel: cmsData.acceptButtonLabel,
    declineButtonLabel: cmsData.declineButtonLabel,
    cookieSettingLinkText: cmsData.cookieSettingLinkText,
    cookieSettingLinkUrl: cmsData.cookieSettingLinkUrl,
  };
};
