import { z } from "zod";
import { type InputProps } from "~/components/inputs/Input";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import {
  strapiWidthSchema,
  strapiWidthToFieldWidth,
} from "../models/strapiWidth";

const StrapiInputSchema = z
  .object({
    name: z.string(),
    label: z.string().nullable(),
    type: z.enum(["text", "number"]),
    placeholder: z.string().nullable(),
    suffix: z.string().nullable(),
    errors: StrapiErrorRelationSchema,
    width: strapiWidthSchema,
    helperText: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiInput = z.infer<typeof StrapiInputSchema>;

export const StrapiInputComponentSchema = StrapiInputSchema.extend({
  __component: z.literal("form-elements.input"),
});

export const getInputProps = (cmsData: StrapiInput): InputProps => ({
  ...omitNull(cmsData),
  width: strapiWidthToFieldWidth(cmsData.width),
  errorMessages: flattenStrapiErrors(cmsData.errors),
});
