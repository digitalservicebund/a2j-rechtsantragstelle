import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StringWithHtmlEntities } from "../StringWithHtmlEntities";
import {
  allowedHeadingLooks,
  allowedHeadingTags,
} from "~/components/common/Heading";

export const StrapiHeadingSchema = z
  .object({
    text: StringWithHtmlEntities,
    tagName: z.enum(allowedHeadingTags),
    look: z.enum(allowedHeadingLooks), // To be removed
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
