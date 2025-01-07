import pick from "lodash/pick";
import { z } from "zod";
import { type InlineNoticeProps } from "~/components/InlineNotice";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "../models/HasStrapiLinkIdentifier";
import { StrapiBackgroundSchema } from "../models/StrapiBackground";
import { StrapiContainerSchema } from "../models/StrapiContainer";

export const StrapiInlineNoticeSchema = z
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

export const getInlineNoticeProps = (
  strapiInlineNotice: StrapiInlineNotice,
): InlineNoticeProps =>
  pick(
    omitNull(strapiInlineNotice),
    "title",
    "tagName",
    "look",
    "content",
    "identifier",
  );
