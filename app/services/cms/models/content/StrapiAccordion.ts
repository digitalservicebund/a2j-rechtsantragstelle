import { z } from "zod";
import { HasStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { StrapiStringOptionalSchema } from "../StrapiStringOptional";

export const StrapiAccordionSchema = z.object({
  items: z
    .array(
      z.object({
        title: z.string(),
        description: buildRichTextValidation(),
        isVisible: StrapiStringOptionalSchema,
        ...HasStrapiIdSchema.shape,
      }),
    )
    .nonempty(),
});
