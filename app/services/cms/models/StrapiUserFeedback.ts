import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiUserFeedbackSchema = z
  .object({
    headingRating: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) => ({
    ...cmsData,
    __component: "page.user-feedback" as const,
    rating: {
      heading: cmsData.headingRating,
    },
  }));
