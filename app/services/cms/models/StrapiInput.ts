import { z } from "zod";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";
import { InputPropsSchema } from "~/components/Input";
import { omitNull } from "~/util/omitNull";

export const StrapiInputSchema = z
  .object({
    __component: z.literal("form-elements.input").optional(),
    name: z.string(),
    label: z.string().nullable(),
    type: z.enum(["text", "number"]),
    placeholder: z.string().nullable(),
    suffix: z.string().nullable(),
    errors: z.object({
      data: z
        .array(
          HasStrapiIdSchema.extend({
            attributes: StrapiErrorCategorySchema,
          }),
        )
        .optional(),
    }),
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

export const getInputProps = (cmsData: StrapiInput) => {
  const errorMessages = cmsData.errors.data?.flatMap(
    (cmsError) => cmsError.attributes.errorCodes,
  );
  const width = cmsData.width?.replace("characters", "");
  return InputPropsSchema.parse(omitNull({ ...cmsData, width, errorMessages }));
};
