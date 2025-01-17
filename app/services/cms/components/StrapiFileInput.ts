import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

const StrapiFileInputSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiFileInputComponentSchema = StrapiFileInputSchema.extend({
  __component: z.literal("form-elements.file-input"),
});
