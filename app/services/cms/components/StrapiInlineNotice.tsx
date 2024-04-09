import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { StrapiHeadingSchema } from "../models/StrapiHeading";
import { OptionalStrapiLinkIdentifierSchema } from "../models/HasStrapiLinkIdentifier";
import { InlineNotice } from "~/components/InlineNotice";

const StrapiInlineNoticeSchema = z
  .object({
    heading: StrapiHeadingSchema.nullable(),
    look: z.enum(["warning", "tips"]),
    content: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiInlineNotice = z.infer<typeof StrapiInlineNoticeSchema>;

export const StrapiInlineNoticeComponentSchema =
  StrapiInlineNoticeSchema.extend({
    __component: z.literal("basic.inline-notice"),
  });

export const StrapiInlineNotice = (strapiInlineNotice: StrapiInlineNotice) => {
  const { heading, look, content } = strapiInlineNotice;
  return (
    <InlineNotice
      heading={heading}
      look={look}
      content={content ?? undefined}
    />
  );
};
