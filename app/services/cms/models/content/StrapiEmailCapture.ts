import { z } from "zod";
import { StrapiInlineNoticeSchema } from "~/services/cms/models/content/StrapiInlineNotice";
import { HasStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { StrapiStringOptionalSchema } from "~/services/cms/models/StrapiStringOptional";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";

export const StrapiEmailCaptureSchema = z.object({
  target: z.string(),
  label: StrapiStringOptionalSchema,
  description: StrapiRichTextOptionalSchema(),
  buttonLabel: z.string(),
  successBanner: StrapiInlineNoticeSchema,
  errorBanner: StrapiInlineNoticeSchema,
  __component: z.literal("page.email-capture"),
  ...HasStrapiIdSchema.shape,
});
