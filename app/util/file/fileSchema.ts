import { z } from "zod";

const maxFileSize = 10 * 1024 * 1024; // 10MB

export const fileSchema = (
  typeof window === "undefined" ? z.any() : z.instanceof(File)
)
  .refine(
    (file?: File) => !!file && file.name !== "" && file.size > 0,
    "File required",
  )
  .refine(
    (file?: File) =>
      file?.type === "application/pdf" && file?.name.endsWith(".pdf"),
    "Only PDF files allowed",
  )
  .refine(
    (file?: File) => !!file && file.size <= maxFileSize,
    "Max file size is 10MB",
  );
