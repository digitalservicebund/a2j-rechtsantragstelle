import { useFetcher } from "react-router";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { useFeedbackTranslations } from "./feedbackTranslations";
import { type FeedbackType } from "./types";
import Button from "~/components/formElements/Button";
import ButtonContainer from "~/components/formElements/ButtonContainer";

export const userRatingFieldname = "wasHelpful";

export type RatingBoxProps = {
  readonly heading: string;
  readonly url: string;
  readonly onSubmit: (feedback: FeedbackType) => void;
};

export const RatingBox = ({ heading, url, onSubmit }: RatingBoxProps) => {
  const ratingFetcher = useFetcher();
  const jsAvailable = useJsAvailable();
  const feedbackTranslations = useFeedbackTranslations();
  return (
    <>
      <h2 className="kern-title kern-title--small">{heading}</h2>
      <footer className="kern-card__footer">
        <ratingFetcher.Form
          method="post"
          action={`/action/send-rating?url=${url}&js=${String(jsAvailable)}`}
          preventScrollReset={true}
        >
          <ButtonContainer>
            <Button
              look="secondary"
              name={userRatingFieldname}
              value="yes"
              type="submit"
              onClick={() => {
                onSubmit("positive");
              }}
              className="w-[152px]"
              aria-label={`${heading}, ${feedbackTranslations["yes-rating"]}`}
            >
              {feedbackTranslations["yes-rating"]}
            </Button>
            <Button
              look="secondary"
              name={userRatingFieldname}
              value="no"
              type="submit"
              className="w-[152px]"
              onClick={() => {
                onSubmit("negative");
              }}
              aria-label={`${heading}, ${feedbackTranslations["no-rating"]}`}
            >
              {feedbackTranslations["no-rating"]}
            </Button>
          </ButtonContainer>
        </ratingFetcher.Form>
      </footer>
    </>
  );
};
