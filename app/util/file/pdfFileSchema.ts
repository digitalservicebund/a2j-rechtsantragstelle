import { z } from "zod";

const TEN_MB_IN_BYTES = 10 * 1024 * 1024;

const errorStateMap = {
  wrongFileType: "Only PDF and TIFF files allowed",
  fileSizeTooBig: "Max file size is 10MB",
  fileRequired: "File required",
};

export const pdfFileMetaDataSchema = z.object({
  filename: z.string(),
  etag: z.string().optional(),
  fileType: z.string().regex(/application\/pdf/),
  fileSize: z.number().max(TEN_MB_IN_BYTES, errorStateMap.fileSizeTooBig),
  createdOn: z.string(),
});

export type PDFFileMetadata = z.infer<typeof pdfFileMetaDataSchema>;
