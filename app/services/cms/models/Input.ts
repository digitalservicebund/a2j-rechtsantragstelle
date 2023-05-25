import { z } from "zod";
import { ErrorCategorySchema } from "./ErrorCategory";

export const InputSchema = z.object({
  id: z.number(),
  __component: z.literal("form-elements.input").optional(),
  name: z.string(),
  label: z.string().nullable(),
  type: z.union([z.literal("text"), z.literal("number")]),
  placeholder: z.string().nullable(),
  errors: z.object({
    data: z
      .array(
        z.object({
          id: z.number(),
          attributes: ErrorCategorySchema,
        })
      )
      .optional(),
  }),
});

export type Input = z.infer<typeof InputSchema>;
