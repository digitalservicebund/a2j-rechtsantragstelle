import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import UploadZone from "~/components/inputs/UploadZone";

const StrapiFileInputSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiFileInput = z.infer<typeof StrapiFileInputSchema>;

export const StrapiFileInputComponentSchema = StrapiFileInputSchema.extend({
  __component: z.literal("form-elements.file-input"),
});

export const renderFileInputFromStrapi = (strapiFileInput: StrapiFileInput) => {
  return <UploadZone name={strapiFileInput.name} />;
};
