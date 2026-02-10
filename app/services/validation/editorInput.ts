import { type ZodType } from "zod";

export const editorInputZodDescription = "editor_input";

export const editorInputSchema = <T extends ZodType>(schema: T) =>
  schema.meta({ description: editorInputZodDescription });
