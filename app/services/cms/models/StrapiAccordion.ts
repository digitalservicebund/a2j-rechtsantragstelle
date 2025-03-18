import { z } from "zod";
import { HasStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { buildRichTextValidation } from "~/services/validation/richtext";

export const StrapiAccordionSchema = z.object({
  items: z.array(
    z
      .object({
        title: z.string(),
        description: buildRichTextValidation(),
      })
      .merge(HasStrapiIdSchema),
  ),
});
