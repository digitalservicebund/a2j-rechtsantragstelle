import { z } from "zod";

export const ButtonSchema = z.object({
  id: z.number(),
  __component: z.literal("form-elements.button").optional(),
  look: z.enum(["primary", "secondary", "tertiary", "ghost"]).optional(),
  size: z.enum(["large", "medium", "small"]).optional(),
  fullWidth: z.boolean().optional(),
  href: z.string().optional(),
  text: z.string().optional(),
});

export type Button = z.infer<typeof ButtonSchema>;
