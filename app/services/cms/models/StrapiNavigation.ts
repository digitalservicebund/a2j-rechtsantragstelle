import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { StrapiNavigationItemSchema } from "./StrapiNavigationItem";

export const StrapiNavigationSchema = z
  .object({
    tree: z.array(StrapiNavigationItemSchema),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema);

export type StrapiNavigation = z.infer<typeof StrapiNavigationSchema>;
