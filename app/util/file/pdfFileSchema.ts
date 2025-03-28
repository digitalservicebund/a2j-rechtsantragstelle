import { z } from "zod";

export const TEN_MB_IN_BYTES = 10 * 1024 * 1024;
export const fileUploadLimit = 5;

export const fileUploadErrorMap = {
  wrongFileType: "Only PDF and TIFF files allowed",
  fileSizeTooBig: "Max file size is 10MB",
  fileRequired: "File required",
  fileLimitReached: (limit?: number) =>
    `A maximum of ${limit ?? fileUploadLimit} files are allowed to be uploaded`,
};

export const pdfFileMetaDataSchema = z.object({
  filename: z.string(),
  savedFileKey: z.string().optional(),
  fileType: z
    .string()
    .regex(/application\/pdf/, fileUploadErrorMap.wrongFileType),
  fileSize: z
    // Need to have string here as html input types (our hidden inputs) always submit strings
    .string()
    .transform((str) => parseInt(str))
    .or(
      z
        .number()
        .max(TEN_MB_IN_BYTES, fileUploadErrorMap.fileSizeTooBig)
        .min(1, fileUploadErrorMap.fileRequired),
    ),
});

export type PDFFileMetadata = z.infer<typeof pdfFileMetaDataSchema>;
