import { z } from "zod";
import { StrapiHiddenInputComponentSchema } from "~/services/cms/models/formElements/StrapiHiddenInput";
import { StrapiInputComponentSchema } from "~/services/cms/models/formElements/StrapiInput";
import { StrapiSelectComponentSchema } from "~/services/cms/models/formElements/StrapiSelect";
import { stringRequiredSchema } from "~/services/validation/stringRequired";

export const StrapiDynamicArraySchema = z.object({
  name: stringRequiredSchema,
  arrayItemLengthVariable: stringRequiredSchema,
  dynamicArrayGroup: z.object({
    description: stringRequiredSchema,
    formComponents: z
      .array(
        z.union([
          StrapiInputComponentSchema,
          StrapiSelectComponentSchema,
          StrapiHiddenInputComponentSchema,
        ]),
      )
      .nonempty(),
  }),
  __component: z.literal("form-elements.dynamic-array"),
});

export type StrapiDynamicArray = z.infer<typeof StrapiDynamicArraySchema>;
