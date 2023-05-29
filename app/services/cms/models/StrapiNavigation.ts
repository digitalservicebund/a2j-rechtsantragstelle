import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { StrapiNavigationItemSchema } from "./StrapiNavigationItem";

export const StrapiNavigationSchema = z
  .object({
    tree: z.array(StrapiNavigationItemSchema),
  })
  .merge(HasStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema)
  .strict();

export type StrapiNavigation = z.infer<typeof StrapiNavigationSchema>;
