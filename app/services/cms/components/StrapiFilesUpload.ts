import { z } from "zod";
import { HasStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { StrapiErrorRelationSchema } from "~/services/cms/models/StrapiErrorRelationSchema";
import { StrapiInlineNoticeSchema } from "~/services/cms/models/StrapiInlineNotice";
import { omitNull } from "~/util/omitNull";
import { StrapiStringOptionalSchema } from "../models/StrapiStringOptional";

export const StrapiFilesUploadComponentSchema = z
  .object({
    __component: z.literal("form-elements.files-upload"),
    name: z.string(),
    title: z.string(),
    description: StrapiStringOptionalSchema,
    inlineNotices: z
      .array(StrapiInlineNoticeSchema)
      .nullable()
      .transform(omitNull),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasStrapiIdSchema)
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors,
  }));
