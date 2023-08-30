import { z } from "zod";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiSelectOptionSchema } from "./StrapiSelectOption";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";

export const StrapiSelectSchema = z
  .object({
    __component: z.literal("form-elements.select").optional(),
    name: z.string(),
    label: z.string().nullable(),
    altLabel: z.string().nullable(),
    options: z.array(StrapiSelectOptionSchema),
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

export type StrapiSelect = z.infer<typeof StrapiSelectSchema>;
