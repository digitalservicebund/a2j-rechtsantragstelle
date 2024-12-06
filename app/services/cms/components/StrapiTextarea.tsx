import { useLocation } from "@remix-run/react";
import { z } from "zod";
import Textarea from "~/components/inputs/Textarea";
import { getContextMaybe } from "~/domains/contexts";
import { flowIdFromPathname } from "~/domains/flowIds";
import {
  flattenStrapiErrors,
  StrapiErrorRelationSchema,
} from "~/services/cms/flattenStrapiErrors";
import { StrapiDetailsSchema } from "~/services/cms/models/StrapiDetails";
import { maxLengthFromStringSchema } from "~/services/validation/maxLengthFromStringSchema";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

const StrapiTextareaSchema = z
  .object({
    name: z.string(),
    description: z.string().nullable(),
    details: StrapiDetailsSchema.nullable(),
    label: z.string().nullable(),
    placeholder: z.string().nullable(),
    errors: StrapiErrorRelationSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiTextarea = z.infer<typeof StrapiTextareaSchema>;

export const StrapiTextareaComponentSchema = StrapiTextareaSchema.extend({
  __component: z.literal("form-elements.textarea"),
});

export const StrapiTextarea = ({ errors, ...props }: StrapiTextarea) => {
  const flowId = flowIdFromPathname(useLocation().pathname);
  const ctx = getContextMaybe(flowId);
  const fieldSchema = ctx?.[props.name];

  return (
    <Textarea
      {...omitNull(props)}
      maxLength={maxLengthFromStringSchema(fieldSchema)}
      errorMessages={flattenStrapiErrors(errors)}
    />
  );
};
