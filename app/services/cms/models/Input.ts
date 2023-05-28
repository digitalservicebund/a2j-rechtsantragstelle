import { z } from "zod";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";
import { HasIdSchema } from "./HasId";

export const InputSchema = z
  .object({
    __component: z.literal("form-elements.input").optional(),
    name: z.string(),
    label: z.string().nullable(),
    type: z.enum(["text", "number"]),
    placeholder: z.string().nullable(),
    errors: z
      .object({
        data: z
          .array(
            z
              .object({
                id: z.number(),
                attributes: StrapiErrorCategorySchema,
              })
              .strict()
          )
          .optional(),
      })
      .strict(),
  })
  .merge(HasIdSchema)
  .strict();

export type Input = z.infer<typeof InputSchema>;
