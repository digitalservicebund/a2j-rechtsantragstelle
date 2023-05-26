import { z } from "zod";
import { HasIdSchema } from "./HasId";

export const MetaSchema = z
  .object({
    title: z.string(),
  })
  .merge(HasIdSchema)
  .strict();

export type Meta = z.infer<typeof MetaSchema>;
