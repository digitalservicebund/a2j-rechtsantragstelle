import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import UploadZone from "~/components/inputs/UploadZone";

const StrapiFileInputSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiFileInputComponentSchema = StrapiFileInputSchema.extend({
  __component: z.literal("form-elements.file-input"),
});

type StrapiFileInput = z.infer<typeof StrapiFileInputSchema>;

export const StrapiFileInput = ({ ...props }: StrapiFileInput) => (
  <UploadZone {...props} />
);
