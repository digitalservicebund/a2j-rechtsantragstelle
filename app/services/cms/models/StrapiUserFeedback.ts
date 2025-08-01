import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";

export const StrapiUserFeedbackSchema = z
  .object({
    headingRating: z.string(),
    __component: z.literal("page.user-feedback"),
    ...HasStrapiIdSchema.shape,
  })
  .transform((cmsData) => ({
    ...cmsData,
    rating: {
      heading: cmsData.headingRating,
    },
  }));
