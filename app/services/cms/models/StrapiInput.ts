import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { InputPropsSchema } from "~/components/inputs/Input";
import { omitNull } from "~/util/omitNull";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";

const StrapiInputSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    type: z.enum(["text", "number"]),
    placeholder: z.string().nullable(),
    suffix: z.string().nullable(),
    errors: StrapiErrorRelationSchema,
    width: z
      .enum([
        "characters3",
        "characters5",
        "characters7",
        "characters10",
        "characters16",
        "characters24",
        "characters36",
        "characters54",
      ])
      .nullish(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiInput = z.infer<typeof StrapiInputSchema>;

export const StrapiInputComponentSchema = StrapiInputSchema.extend({
  __component: z.literal("form-elements.input"),
});

export const getInputProps = (cmsData: StrapiInput) => {
  const errorMessages = flattenStrapiErrors(cmsData.errors);
  const width = cmsData.width?.replace("characters", "");
  return InputPropsSchema.parse(omitNull({ ...cmsData, width, errorMessages }));
};
