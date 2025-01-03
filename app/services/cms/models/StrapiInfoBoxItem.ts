import pick from "lodash/pick";
import { z } from "zod";
import type { InfoBoxItemProps } from "~/components/InfoBoxItem";
import {
  getInlineNoticeProps,
  StrapiInlineNoticeSchema,
} from "~/services/cms/models/StrapiInlineNotice";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiButtonSchema } from "./StrapiButton";
import { getDetailsProps, StrapiDetailsSchema } from "./StrapiDetails";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiImageSchema, getImageProps } from "./StrapiImage";

export const StrapiInfoBoxItemSchema = z
  .object({
    label: StrapiHeadingSchema.nullable(),
    headline: StrapiHeadingSchema.nullable(),
    image: StrapiImageSchema.nullable(),
    content: z.string().nullable(),
    detailsSummary: z.array(StrapiDetailsSchema),
    inlineNotice: z.array(StrapiInlineNoticeSchema),
    buttons: z.array(StrapiButtonSchema),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiInfoBoxItem = z.infer<typeof StrapiInfoBoxItemSchema>;

export const getInfoBoxItemProps = (
  cmsData: StrapiInfoBoxItem,
): InfoBoxItemProps =>
  omitNull({
    details: cmsData.detailsSummary.map(getDetailsProps),
    inlineNotices: cmsData.inlineNotice.map(getInlineNoticeProps),
    image: getImageProps(cmsData.image),
    ...pick(cmsData, "label", "headline", "content", "buttons", "identifier"),
  });
