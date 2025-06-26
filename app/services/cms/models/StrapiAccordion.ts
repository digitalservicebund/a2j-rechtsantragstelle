import { z } from "zod";
import { HasStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { StrapiOptionalStringSchema } from "./StrapiOptionalString";

export const StrapiAccordionSchema = z.object({
  items: z
    .array(
      z
        .object({
          title: z.string(),
          description: buildRichTextValidation(),
          isVisible: StrapiOptionalStringSchema,
        })
        .merge(HasStrapiIdSchema),
    )
    .nonempty(),
});
