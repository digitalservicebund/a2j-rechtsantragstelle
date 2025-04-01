import { z } from "zod";

export const TEN_MB_IN_BYTES = 10 * 1024 * 1024;
export const fileUploadLimit = 5;

export const pdfFileMetaDataSchema = z.object({
  filename: z.string(),
  savedFileKey: z.string().optional(),
  fileType: z.string().regex(/application\/pdf/, { message: "wrongFileType" }),
  fileSize: z
    // Need to have string here as html input types (our hidden inputs) always submit strings
    .string()
    .transform((str) => parseInt(str))
    .or(
      z
        .number()
        .max(TEN_MB_IN_BYTES, { message: "fileSizeTooBig" })
        .min(1, { message: "fileRequired" }),
    ),
});

export type PDFFileMetadata = z.infer<typeof pdfFileMetaDataSchema>;
