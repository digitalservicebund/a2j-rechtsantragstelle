import { z } from "zod";

export const NavigationItemSchema = z.object({
  id: z.number(),
  text: z.string(),
  targeturl: z.string(),
  baseurl: z.string(),
});

export type NavigationItem = z.infer<typeof NavigationItemSchema>;
