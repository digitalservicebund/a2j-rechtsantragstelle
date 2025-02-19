import { z } from "zod";

const maxFileSize = 10 * 1024 * 1024; // 10MB

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "File required")
  .refine(
    (file) => file.type === "application/pdf" && file.name.endsWith(".pdf"),
    "Only PDF files allowed",
  )
  .refine((file) => file.size <= maxFileSize, "Max file size is 10MB");
