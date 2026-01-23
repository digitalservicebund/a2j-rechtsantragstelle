import { StrapiStringOptionalSchema } from "~/services/cms/models/StrapiStringOptional";
import { z } from "zod";
import { integerSchema } from "~/services/validation/integer";
import { omitNull } from "~/util/omitNull";

export const StrapiNumberIncrementSchema = z.object({
  name: z.string(),
  label: StrapiStringOptionalSchema,
  min: integerSchema,
  max: z.number().nullable().transform(omitNull).optional(),
  __component: z.literal("form-elements.number-increment"),
});

export type NumberIncrementProps = z.infer<typeof StrapiNumberIncrementSchema>;
