import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiButtonSchema = z
  .object({
    __component: z.literal("form-elements.button").optional(),
    look: z.enum(["primary", "secondary", "tertiary", "ghost"]).optional(),
    size: z.enum(["large", "medium", "small"]).optional(),
    fullWidth: z.boolean().optional(),
    href: z.string().optional(),
    text: z.string().optional(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .strict();

export type StrapiButton = z.infer<typeof StrapiButtonSchema>;
