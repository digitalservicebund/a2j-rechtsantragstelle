import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StringWithHtmlEntities } from "../StringWithHtmlEntities";
import { SIZES } from "~/components/kern/KernHeading";
import { StrapiPaddingOptionalSchema } from "../StrapiPadding";
import { allowedHeadingTags } from "~/components/kern/types";

export const StrapiHeadingSchema = z
  .object({
    text: StringWithHtmlEntities,
    tagName: z.enum(allowedHeadingTags),
    paddingTop: StrapiPaddingOptionalSchema,
    paddingBottom: StrapiPaddingOptionalSchema,
    size: z.enum(SIZES).nullable().transform(omitNull).optional(),
    ...HasStrapiIdSchema.shape,
  })
  .transform((cmsData) => {
    return {
      __component: "basic.heading" as const,
      ...cmsData,
    };
  });

export const StrapiHeadingOptionalSchema = StrapiHeadingSchema.nullable()
  .transform(omitNull)
  .optional();
