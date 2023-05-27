import { z } from "zod";
import { HasIdSchema } from "./HasId";
import { HasLocaleSchema } from "./HasLocale";
import { HasTimestampsSchema } from "./HasTimestamps";
import { NavigationItemSchema } from "./NavigationItem";

export const NavigationSchema = z
  .object({
    tree: z.array(NavigationItemSchema),
  })
  .merge(HasIdSchema)
  .merge(HasLocaleSchema)
  .merge(HasTimestampsSchema)
  .strict();

export type Navigation = z.infer<typeof NavigationSchema>;
