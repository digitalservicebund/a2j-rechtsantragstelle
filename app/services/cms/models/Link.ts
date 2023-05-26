import { z } from "zod";
import { HasIdSchema } from "./HasId";

export const LinkSchema = z
  .object({
    url: z.string().nullable(),
    text: z.string().nullable(),
  })
  .merge(HasIdSchema)
  .strict();

export type Link = z.infer<typeof LinkSchema>;
