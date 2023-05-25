import { z } from "zod";
import { SelectOptionSchema } from "./SelectOption";

export const SelectSchema = z.object({
  id: z.number(),
  __component: z.literal("form-elements.select").optional(),
  name: z.string(),
  label: z.string().nullable(),
  altLabel: z.string().nullable(),
  options: z.array(SelectOptionSchema),
});

export type Select = z.infer<typeof SelectSchema>;
