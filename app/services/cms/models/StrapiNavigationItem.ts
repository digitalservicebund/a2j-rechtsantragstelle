import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";

export const StrapiNavigationItemSchema = z
  .object({
    text: z.string(),
    targeturl: z.string(),
    baseurl: z.string(),
  })
  .merge(HasStrapiIdSchema)
  .strict();

export type StrapiNavigationItem = z.infer<typeof StrapiNavigationItemSchema>;
