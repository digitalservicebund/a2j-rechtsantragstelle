import { z } from "zod";
import { HasStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { StrapiInlineNoticeSchema } from "~/services/cms/models/StrapiInlineNotice";
import { StrapiStringOptionalSchema } from "~/services/cms/models/StrapiStringOptional";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";

export const StrapiEmailCaptureSchema = z
  .object({
    target: z.string(),
    label: StrapiStringOptionalSchema,
    description: StrapiRichTextOptionalSchema(),
    buttonLabel: z.string(),
    successBanner: StrapiInlineNoticeSchema,
    errorBanner: StrapiInlineNoticeSchema,
    __component: z.literal("page.email-capture"),
  })
  .merge(HasStrapiIdSchema);
