import { z } from "zod";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiErrorCategorySchema } from "./StrapiErrorCategory";
import { omitNull } from "~/util/omitNull";
import { DropdownPropsSchema } from "~/components/inputs/Select";

export const StrapiDropdownSchema = z
  .object({
    __component: z.literal("form-elements.dropdown").optional(),
    name: z.string(),
    label: z.string().nullable(),
    altLabel: z.string().nullable(),
    options: z.array(z.object({ value: z.string(), text: z.string() })),
    placeholder: z.string().nullish(),
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

type StrapiDropdown = z.infer<typeof StrapiDropdownSchema>;

export const getDropdownProps = (cmsData: StrapiDropdown) => {
  const errorMessages = cmsData.errors.data?.flatMap(
    (cmsError) => cmsError.attributes.errorCodes,
  );
  return DropdownPropsSchema.parse(omitNull({ ...cmsData, errorMessages }));
};
