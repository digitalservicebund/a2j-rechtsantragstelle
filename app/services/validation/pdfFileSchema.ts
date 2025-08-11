import { z } from "zod";

export const TEN_MB_IN_BYTES = 10 * 1024 * 1024;
export const FIFTEEN_MB_IN_BYTES = 15 * 1024 * 1024;
export const fileUploadLimit = 5;
export const errorStyling = "bg-red-200! border border-red-900 border-2";

export const pdfFileMetaDataSchema = z.object({
  filename: z.string(),
  savedFileKey: z.string().optional(),
  fileType: z.string().regex(/application\/pdf/, { message: "wrongFileType" }),
  fileSize: z.coerce
    .number()
    .int()
    .min(1, { message: "fileRequired" })
    .max(TEN_MB_IN_BYTES, { message: "fileTooLarge" }),
});

const pdfFileUploadArraySchema = z
  .array(pdfFileMetaDataSchema)
  .max(fileUploadLimit, { message: "fileLimitReached" });

export const pdfFileUploadArrayOptionalSchema =
  pdfFileUploadArraySchema.optional();

export const pdfFileUploadArrayRequiredSchema = pdfFileUploadArraySchema
  .nonempty({ message: "fileRequired" })
  .optional(); // Must remain despite being required, as the zod schema has no knowledge of which field is required

export type PDFFileMetadata = z.infer<typeof pdfFileMetaDataSchema>;
