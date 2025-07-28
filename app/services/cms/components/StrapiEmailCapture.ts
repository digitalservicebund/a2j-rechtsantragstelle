import { z } from "zod";
import { HasStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { StrapiInlineNoticeSchema } from "~/services/cms/models/StrapiInlineNotice";
import { StrapiOptionalStringSchema } from "~/services/cms/models/StrapiOptionalString";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";

export const StrapiEmailCaptureSchema = z.object({
  target: z.string(),
  label: StrapiOptionalStringSchema,
  description: StrapiRichTextOptionalSchema(),
  buttonLabel: z.string(),
  successBanner: StrapiInlineNoticeSchema,
  errorBanner: StrapiInlineNoticeSchema,
  __component: z.literal("page.email-capture"),
  ...HasStrapiIdSchema.shape,
});
