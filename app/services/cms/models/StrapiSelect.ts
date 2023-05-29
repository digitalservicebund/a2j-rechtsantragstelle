import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiSelectOptionSchema } from "./StrapiSelectOption";

export const StrapiSelectSchema = z
  .object({
    __component: z.literal("form-elements.select").optional(),
    name: z.string(),
    label: z.string().nullable(),
    altLabel: z.string().nullable(),
    options: z.array(StrapiSelectOptionSchema),
  })
  .merge(HasStrapiIdSchema)
  .strict();

export type StrapiSelect = z.infer<typeof StrapiSelectSchema>;
