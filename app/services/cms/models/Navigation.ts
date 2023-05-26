import { z } from "zod";
import { HasLocaleSchema } from "./HasLocale";
import { HasTimestampsSchema } from "./HasTimestamps";
import { NavigationItemSchema } from "./NavigationItem";

export const NavigationSchema = z
  .object({
    tree: z.array(NavigationItemSchema),
  })
  .merge(HasLocaleSchema)
  .merge(HasTimestampsSchema)
  .strict();

export type Navigation = z.infer<typeof NavigationSchema>;
