import { useFetcher } from "react-router";
import ButtonContainer from "~/components/common/ButtonContainer";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { useFeedbackTranslations } from "./feedbackTranslations";
import { type FeedbackType } from "./types";
import KernButton from "../KernButton";

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
            <KernButton
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
            </KernButton>
            <KernButton
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
            </KernButton>
          </ButtonContainer>
        </ratingFetcher.Form>
      </footer>
    </>
  );
};
