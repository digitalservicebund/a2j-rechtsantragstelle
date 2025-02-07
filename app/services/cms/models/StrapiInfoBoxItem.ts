import pick from "lodash/pick";
import { z } from "zod";
import type { InfoBoxItemProps } from "~/components/InfoBoxItem";
import { StrapiHeadingSchema } from "~/services/cms/models/StrapiHeading";
import {
  getInlineNoticeProps,
  StrapiInlineNoticeSchema,
} from "~/services/cms/models/StrapiInlineNotice";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiButtonSchema } from "./StrapiButton";
import { getDetailsProps, StrapiDetailsSchema } from "./StrapiDetails";
import { StrapiImageSchema } from "./StrapiImage";

export const StrapiInfoBoxItemSchema = z
  .object({
    label: StrapiHeadingSchema.nullable(),
    headline: StrapiHeadingSchema.nullable(),
    image: StrapiImageSchema.nullable(),
    content: buildRichTextValidation().nullable(),
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
    ...pick(
      cmsData,
      "image",
      "label",
      "headline",
      "content",
      "buttons",
      "identifier",
    ),
  });
