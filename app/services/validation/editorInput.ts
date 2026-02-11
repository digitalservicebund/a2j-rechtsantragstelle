import z from "zod";

export const editorInputZodDescription = "editor_input";

export const editorInputOptionalSchema = z
  .object({
    markdownContent: z.string(),
    htmlContent: z.string(),
  })
  .optional()
  .meta({ description: editorInputZodDescription });
