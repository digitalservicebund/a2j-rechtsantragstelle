import { z } from "zod";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";
import { omitNull } from "~/util/omitNull";
import { TextareaPropsSchema } from "~/components/inputs/Textarea";

export const StrapiTextareaSchema = z
  .object({
    __component: z.literal("form-elements.textarea").optional(),
    name: z.string(),
    label: z.string().nullable(),
    placeholder: z.string().nullable(),
    errors: z.object({
      data: z
        .array(
          HasStrapiIdSchema.extend({
            attributes: StrapiErrorCategorySchema,
          }),
        )
        .optional(),
    }),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiTextarea = z.infer<typeof StrapiTextareaSchema>;

export const getTextareaProps = (cmsData: StrapiTextarea) => {
  const errorMessages = cmsData.errors.data?.flatMap(
    (cmsError) => cmsError.attributes.errorCodes,
  );
  return TextareaPropsSchema.parse(omitNull({ ...cmsData, errorMessages }));
};
