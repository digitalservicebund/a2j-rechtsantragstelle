import { z } from "zod";
import { HasIdSchema } from "./HasId";
import { SelectOptionSchema } from "./SelectOption";

export const SelectSchema = z
  .object({
    __component: z.literal("form-elements.select").optional(),
    name: z.string(),
    label: z.string().nullable(),
    altLabel: z.string().nullable(),
    options: z.array(SelectOptionSchema),
  })
  .merge(HasIdSchema)
  .strict();

export type Select = z.infer<typeof SelectSchema>;
