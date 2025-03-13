import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "~/services/cms/models/HasStrapiId";

export const StrapiAccordionSchema = z
  .object({
    items: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
  })
  .merge(HasOptionalStrapiIdSchema);
