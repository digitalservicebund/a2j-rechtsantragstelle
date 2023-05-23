import { z } from "zod";
import { ErrorCategorySchema } from "./ErrorCategory";

export const InputSchema = z.object({
  id: z.number(),
  __component: z.literal("form-elements.input"),
  name: z.string(),
  label: z.string().optional(),
  type: z.union([z.literal("text"), z.literal("number")]),
  placeholder: z.string().optional(),
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
