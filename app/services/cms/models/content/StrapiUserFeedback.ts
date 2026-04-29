import { z } from "zod";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiPaddingOptionalSchema } from "../StrapiPadding";

export const StrapiUserFeedbackSchema = z
  .object({
    headingRating: z.string(),
    __component: z.literal("page.user-feedback"),
  paddingTop: StrapiPaddingOptionalSchema,
  paddingBottom: StrapiPaddingOptionalSchema,
    ...HasStrapiIdSchema.shape,
  })
  .transform((cmsData) => ({
    ...cmsData,
    rating: {
      heading: cmsData.headingRating,
    },
  }));
