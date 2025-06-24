import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { StrapiInlineNoticeSchema } from "~/services/cms/models/StrapiInlineNotice";
import { omitNull } from "~/util/omitNull";

export const StrapiFilesUploadComponentSchema = z
  .object({
    __component: z.literal("form-elements.files-upload"),
    name: z.string(),
    title: z.string(),
    description: z.string().nullable().transform(omitNull),
    inlineNotices: z
      .array(StrapiInlineNoticeSchema)
      .nullable()
      .transform(omitNull),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
