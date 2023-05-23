import { z } from "zod";
import { SelectOptionSchema } from "./SelectOption";

export const SelectSchema = z.object({
  id: z.number(),
  __component: z.literal("form-elements.select"),
  name: z.string(),
  label: z.string().optional(),
  altLabel: z.string().optional(),
  options: z.array(SelectOptionSchema),
});

export type Select = z.infer<typeof SelectSchema>;
