import { z } from "zod";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";

export const StrapiInputSchema = z
  .object({
    __component: z.literal("form-elements.input").optional(),
    name: z.string(),
    label: z.string().nullable(),
    type: z.enum(["text", "number"]),
    placeholder: z.string().nullable(),
    suffix: z.string().nullable(),
    errors: z.object({
      data: z
        .array(
          HasStrapiIdSchema.extend({
            attributes: StrapiErrorCategorySchema,
          }),
        )
        .optional(),
    }),
  })
  .merge(HasOptionalStrapiIdSchema);

export type StrapiInput = z.infer<typeof StrapiInputSchema>;
