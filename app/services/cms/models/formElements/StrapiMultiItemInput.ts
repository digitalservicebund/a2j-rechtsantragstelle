import { z } from "zod";
import { StrapiErrorCategorySchema } from "../StrapiErrorCategory";

/**
 * CMS component for "geschlossen" variant multi-item input.
 * Renders N fieldsets on a single page based on a count field.
 */
export const StrapiMultiItemInputComponentSchema = z
  .object({
    __component: z.literal("form-elements.multi-item-input"),
    name: z.string(),
    countField: z.string().optional(), // User data field containing the count (e.g., "kinderAnzahl")
    itemTitle: z.string(), // Title template with {{index}} placeholder
    fields: z.array(
      z.object({
        name: z.string(),
        label: z.string(),
        type: z.enum(["text", "select"]),
        options: z
          .array(z.object({ value: z.string(), label: z.string() }))
          .optional(),
        required: z.boolean().optional(),
      }),
    ),
    errors: StrapiErrorCategorySchema.optional(),
    // Static count or runtime-injected count.
    count: z.number().optional(),
  })
  .transform(({ errors, ...cmsData }) => ({
    ...cmsData,
    errorMessages: errors?.errorCodes,
  }));
