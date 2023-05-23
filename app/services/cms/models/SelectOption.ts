import { z } from "zod";

export const SelectOptionSchema = z.object({
  id: z.number().optional(),
  text: z.string(),
  value: z.string(),
});

export type SelectOption = z.infer<typeof SelectOptionSchema>;
