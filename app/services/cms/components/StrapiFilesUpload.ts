import { z } from "zod";
import { FilesUploadProps } from "~/components/filesUpload/FilesUpload";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

const StrapiFilesUploadSchema = z
  .object({
    name: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiFilesUploadComponentSchema = StrapiFilesUploadSchema.extend({
  __component: z.literal("form-elements.file-input"),
});

type StrapiFilesUpload = z.infer<typeof StrapiFilesUploadSchema>;

export function getFilesUploadProps(
  props: StrapiFilesUpload,
): FilesUploadProps {
  return {
    ...omitNull(props),
  };
}
