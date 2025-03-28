import { z } from "zod";
import { HasStrapiIdSchema } from "~/services/cms/models/HasStrapiId";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";

export const StrapiAccordionSchema = z.object({
  items: z
    .array(
      z
        .object({
          title: z.string(),
          description: buildRichTextValidation(),
          shouldDisplay: z.string().nullable().transform(omitNull),
        })
        .merge(HasStrapiIdSchema),
    )
    .nonempty(),
});
