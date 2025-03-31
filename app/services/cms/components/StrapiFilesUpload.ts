import { z } from "zod";
import { type FilesUploadProps } from "~/components/filesUpload/FilesUpload";
import { StrapiErrorRelationSchema } from "~/services/cms/flattenStrapiErrors";
import { StrapiInlineNoticeSchema } from "~/services/cms/models/StrapiInlineNotice";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

const StrapiFilesUploadSchema = z
  .object({
    name: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    inlineNotice: z.array(StrapiInlineNoticeSchema).optional(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiFilesUploadComponentSchema = StrapiFilesUploadSchema.extend({
  __component: z.literal("form-elements.files-upload"),
});

type StrapiFilesUpload = z.infer<typeof StrapiFilesUploadSchema>;

export function getFilesUploadProps(
  props: StrapiFilesUpload,
): FilesUploadProps {
  return {
    ...omitNull(props),
  };
}
