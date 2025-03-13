import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { buildRichTextValidation } from "~/services/validation/richtext";

export const StrapiAccordionSchema = z
  .object({
    items: z.array(
      z.object({
        title: z.string(),
        description: buildRichTextValidation(),
      }),
    ),
  })
  .merge(HasOptionalStrapiIdSchema);
