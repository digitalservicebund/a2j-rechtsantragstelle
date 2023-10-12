import { z } from "zod";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";

export const StrapiTextareaSchema = z
  .object({
    __component: z.literal("form-elements.textarea").optional(),
    name: z.string(),
    label: z.string().nullable(),
    placeholder: z.string().nullable(),
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

export type StrapiTextarea = z.infer<typeof StrapiTextareaSchema>;
