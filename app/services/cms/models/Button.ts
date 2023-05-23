import { z } from "zod";

export const ButtonSchema = z.object({
  id: z.string(), // TODO: check why this can't be a number
  __component: z.literal("form-elements.button"),
  look: z
    .union([
      z.literal("primary"),
      z.literal("secondary"),
      z.literal("tertiary"),
      z.literal("ghost"),
    ])
    .optional(),
  size: z
    .union([z.literal("large"), z.literal("medium"), z.literal("small")])
    .optional(),
  fullWidth: z.boolean().optional(),
  href: z.string().optional(),
  text: z.string().optional(),
});

export type Button = z.infer<typeof ButtonSchema>;
