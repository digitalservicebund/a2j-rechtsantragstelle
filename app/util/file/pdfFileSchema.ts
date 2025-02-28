import { z } from "zod";

const TEN_MB_IN_BYTES = 10 * 1024 * 1024;
const maxFileSize = TEN_MB_IN_BYTES;

const errorStateMap = {
  wrongFileType: "Only PDF and TIFF files allowed",
  fileSizeTooBig: "Max file size is 10MB",
  fileRequired: "File required",
};

export const fileMetaDataSchema = z.object({
  filename: z.string(),
  etag: z.string().optional(),
  fileType: z.literal("application/pdf"),
  fileSize: z.number().max(TEN_MB_IN_BYTES, errorStateMap.fileSizeTooBig),
  createdOn: z.string(),
});

export type FileMetadata = z.infer<typeof fileMetaDataSchema>;

export const pdfFileSchema = (
  typeof window === "undefined" ? z.any() : z.instanceof(File)
)
  .refine(
    (file?: File) => !!file && file.name !== "" && file.size > 0,
    errorStateMap.fileRequired,
  )
  .refine(
    (file?: File) =>
      (file?.type === "application/pdf" && file?.name.endsWith(".pdf")) ||
      (file?.type === "image/tiff" && file?.name.endsWith(".tiff")) ||
      (file?.type === "image/tif" && file?.name.endsWith(".tif")),
    errorStateMap.wrongFileType,
  )
  .refine(
    (file?: File) => !!file && file.size <= maxFileSize,
    errorStateMap.fileSizeTooBig,
  );
