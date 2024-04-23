import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { getRichTextProps, StrapiParagraphSchema } from "./StrapiParagraph";
import { omitNull } from "~/util/omitNull";
import { CookieBannerContentPropsSchema } from "~/components/CookieBanner";

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

export type StrapiCookieBanner = z.infer<typeof StrapiCookieBannerSchema>;

export const getCookieBannerProps = (cmsData: StrapiCookieBanner) => {
  const paragraphs = cmsData.paragraphs.map((paragraph) =>
    getRichTextProps(paragraph),
  );
  return CookieBannerContentPropsSchema.parse(
    omitNull({ ...cmsData, paragraphs }),
  );
};
