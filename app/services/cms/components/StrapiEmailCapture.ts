import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { StrapiInlineNoticeSchema } from "~/services/cms/models/StrapiInlineNotice";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";

export const StrapiEmailCaptureSchema = z
  .object({
    target: z.string(),
    label: z.string().nullable(),
    description: buildRichTextValidation().nullable(),
    buttonLabel: z.string().nullable(),
    successBanner: StrapiInlineNoticeSchema,
    errorBanner: StrapiInlineNoticeSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) => ({
    ...omitNull(cmsData),
    __component: "page.email-capture" as const,
  }));
