import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import UploadZone from "~/components/inputs/UploadZone";

export const StrapiFileInputSchema = z
  .object({
    __component: z.literal("form-elements.file-input").optional(),
    name: z.string(),
    label: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiFileInput = z.infer<typeof StrapiFileInputSchema>;

export const renderFileInputFromStrapi = (strapiFileInput: StrapiFileInput) => {
  return <UploadZone name={strapiFileInput.name} />;
};
