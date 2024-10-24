import { z } from "zod";
import { InlineNotice } from "~/components/InlineNotice";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "../models/HasStrapiLinkIdentifier";
import { StrapiBackgroundSchema } from "../models/StrapiBackground";
import { StrapiContainerSchema } from "../models/StrapiContainer";

const StrapiInlineNoticeSchema = z
  .object({
    title: z.string(),
    tagName: z.enum(["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"]),
    look: z.enum(["warning", "tips"]),
    content: z.string().nullable(),
    container: StrapiContainerSchema,
    outerBackground: StrapiBackgroundSchema.nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiInlineNotice = z.infer<typeof StrapiInlineNoticeSchema>;

export const StrapiInlineNoticeComponentSchema =
  StrapiInlineNoticeSchema.extend({
    __component: z.literal("page.inline-notice"),
  });

export const StrapiInlineNotice = (strapiInlineNotice: StrapiInlineNotice) => {
  const props = omitNull(strapiInlineNotice);
  return <InlineNotice {...props} />;
};
