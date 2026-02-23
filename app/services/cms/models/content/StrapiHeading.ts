import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StringWithHtmlEntities } from "../StringWithHtmlEntities";
import {
  allowedHeadingLooks,
  allowedHeadingTags,
} from "~/components/common/Heading";
import { SIZES } from "~/components/kern/KernHeading";

export const StrapiHeadingSchema = z
  .object({
    text: StringWithHtmlEntities,
    tagName: z.enum(allowedHeadingTags),
    look: z.enum(allowedHeadingLooks), // To be removed after KERN migration
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
