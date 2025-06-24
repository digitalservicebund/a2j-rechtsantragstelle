import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";

export const StrapiEmailCaptureSchema = z
  .object({
    target: z.string(),
    label: z.string().nullable(),
    description: buildRichTextValidation().nullable(),
    buttonLabel: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) => ({
    ...omitNull(cmsData),
    __component: "page.email-capture" as const,
  }));
