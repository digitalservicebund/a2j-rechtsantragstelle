import { z } from "zod";
import UserFeedback from "~/components/UserFeedback";
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
        yesButtonLabel: "Ja",
        noButtonLabel: "Nein",
      }}
      feedback={{
        heading: "Was können wir verbessern?",
        placeholder: "Bitte tragen Sie keine persönlichen Daten ein!",
        abortButtonLabel: "Abbrechen",
        submitButtonLabel: "Abschicken",
      }}
      postSubmission={{
        heading: "Vielen Dank!",
        text: "Ihr Feedback hilft uns, diese Seite für alle Nutzenden zu verbessern!",
      }}
    />
  );
};
