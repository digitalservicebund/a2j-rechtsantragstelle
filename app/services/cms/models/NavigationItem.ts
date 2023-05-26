import { z } from "zod";
import { HasIdSchema } from "./HasId";

export const NavigationItemSchema = z
  .object({
    text: z.string(),
    targeturl: z.string(),
    baseurl: z.string(),
  })
  .merge(HasIdSchema)
  .strict();

export type NavigationItem = z.infer<typeof NavigationItemSchema>;
