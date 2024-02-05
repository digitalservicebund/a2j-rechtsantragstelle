import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { omitNull } from "~/util/omitNull";

export const StrapiArrayElementSchema = z
  .object({
    __component: z.literal("page.array-element"),
    title: z.string(),
    elementKey: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiArrayElement = z.infer<typeof StrapiArrayElementSchema>;

export const getArrayElementProps = (cmsData: StrapiArrayElement) => {
  return StrapiArrayElementSchema.parse(omitNull(cmsData));
};
