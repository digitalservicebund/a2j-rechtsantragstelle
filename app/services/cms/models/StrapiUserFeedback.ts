import { z } from "zod";
import { type UserFeedbackProps } from "~/components/userFeedback";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiUserFeedbackSchema = z
  .object({
    headingRating: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiUserFeedback = z.infer<typeof StrapiUserFeedbackSchema>;

export const StrapiUserFeedbackComponentSchema =
  StrapiUserFeedbackSchema.extend({
    __component: z.literal("page.user-feedback"),
  });

export const getUserFeedbackProps = ({
  headingRating,
}: StrapiUserFeedback): UserFeedbackProps => ({
  rating: { heading: headingRating },
});
