import { z } from "zod";
import { HasStrapiIdSchema } from "~/services/cms/models/HasStrapiId";

export const StrapiHiddenInputComponentSchema = z
  .object({
    __component: z.literal("form-elements.hidden-input"),
    name: z.string(),
  })
  .merge(HasStrapiIdSchema);
