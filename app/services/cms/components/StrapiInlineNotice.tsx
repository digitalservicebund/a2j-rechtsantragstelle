import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "../models/HasStrapiLinkIdentifier";
import { InlineNotice } from "~/components/InlineNotice";
import { omitNull } from "~/util/omitNull";
import { StrapiBackgroundSchema } from "../models/StrapiBackground";

const StrapiInlineNoticeSchema = z
  .object({
    title: z.string(),
    tagName: z.enum(["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"]),
    look: z.enum(["warning", "tips"]),
    content: z.string().optional(),
    outerBackground: StrapiBackgroundSchema.nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiInlineNotice = z.infer<typeof StrapiInlineNoticeSchema>;

export const StrapiInlineNoticeComponentSchema =
  StrapiInlineNoticeSchema.extend({
    __component: z.literal("basic.inline-notice"),
  });

export const StrapiInlineNotice = (strapiInlineNotice: StrapiInlineNotice) => {
  const props = omitNull(strapiInlineNotice);
  return <InlineNotice {...props} />;
};
