import { z } from "zod";
import { NavigationItemSchema } from "./NavigationItem";

export const NavigationSchema = z.object({
  locale: z.literal("de"),
  tree: z.array(NavigationItemSchema),
});

export type Navigation = z.infer<typeof NavigationSchema>;
