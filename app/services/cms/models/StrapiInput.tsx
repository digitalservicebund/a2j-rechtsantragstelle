import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import Input, { type InputProps } from "~/components/inputs/Input";
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

function convertWidth(width: StrapiInput["width"]) {
  return (width?.replace("characters", "") ?? undefined) as InputProps["width"];
}

export const StrapiInput = ({ errors, width, ...props }: StrapiInput) => {
  return (
    <Input
      width={convertWidth(width)}
      errorMessages={flattenStrapiErrors(errors)}
      {...props}
    />
  );
};
