import { z } from "zod";
import { type EmailCaptureProps } from "~/components/userFeedback/EmailCapture";
import { HasOptionalStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { StrapiButtonSchema } from "~/services/cms/models/StrapiButton";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";

const StrapiEmailCaptureSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    description: buildRichTextValidation().nullable(),
    submit: StrapiButtonSchema.nullable().transform(omitNull).optional(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiEmailCapture = z.infer<typeof StrapiEmailCaptureSchema>;

export const StrapiEmailCaptureComponentSchema =
  StrapiEmailCaptureSchema.extend({
    __component: z.literal("form-elements.email-capture"),
  });

export const getEmailCaptureProps = (
  cmsData: StrapiEmailCapture,
): EmailCaptureProps => ({
  ...omitNull(cmsData),
});
