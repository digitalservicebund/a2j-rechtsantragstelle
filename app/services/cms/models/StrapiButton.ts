import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiButtonSchema = z
  .object({
    __component: z.literal("form-elements.button").optional(),
    look: z.enum(["primary", "secondary", "tertiary", "ghost"]),
    size: z.enum(["large", "medium", "small"]),
    fullWidth: z.boolean(),
    href: z.string().nullable(),
    text: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .strict();

export type StrapiButton = z.infer<typeof StrapiButtonSchema>;
