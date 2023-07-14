import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiNavigationItemSchema = z
  .object({
    text: z.string(),
    targeturl: z.string(),
    baseurl: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema);

export type StrapiNavigationItem = z.infer<typeof StrapiNavigationItemSchema>;
