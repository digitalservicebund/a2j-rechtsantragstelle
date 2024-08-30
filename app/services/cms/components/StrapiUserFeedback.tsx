import { z } from "zod";
import UserFeedback from "~/components/userFeedback";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

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

export const StrapiUserFeedback = ({ headingRating }: StrapiUserFeedback) => {
  return (
    <UserFeedback
      rating={{
        heading: headingRating,
      }}
    />
  );
};
