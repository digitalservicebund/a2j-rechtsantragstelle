import { z } from "zod";

export const ResultPageTypeSchema = z.enum(["error", "success", "warning"]);

export type ResultPageType = z.infer<typeof ResultPageTypeSchema>;
