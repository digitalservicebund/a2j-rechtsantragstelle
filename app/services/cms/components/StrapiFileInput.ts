import { z } from "zod";
import { FileInputProps } from "~/components/inputs/FileInput";
import { omitNull } from "~/util/omitNull";
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

type StrapiFileInput = z.infer<typeof StrapiFileInputSchema>;

export function getFileInputProps(props: StrapiFileInput): FileInputProps {
  return omitNull(props);
}
