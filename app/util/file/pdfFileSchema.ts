import { z } from "zod";

const TEN_MB_IN_BYTES = 10 * 1024 * 1024;
const maxFileSize = TEN_MB_IN_BYTES;

const errorStateMap = {
  wrongFileType: "Only PDF files allowed",
  fileSizeTooBig: "Max file size is 10MB",
  fileRequired: "File required",
};

export const pdfFileSchema = (
  typeof window === "undefined" ? z.any() : z.instanceof(File)
)
  .refine(
    (file?: File) => !!file && file.name !== "" && file.size > 0,
    errorStateMap.fileRequired,
  )
  .refine(
    (file?: File) =>
      file?.type === "application/pdf" && file?.name.endsWith(".pdf"),
    errorStateMap.wrongFileType,
  )
  .refine(
    (file?: File) => !!file && file.size <= maxFileSize,
    errorStateMap.fileSizeTooBig,
  );
