import ThumbDownIcon from "@digitalservicebund/icons/ThumbDownOutlined";
import ThumbUpIcon from "@digitalservicebund/icons/ThumbUpOutlined";
import { useFetcher } from "react-router";
import Button from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import Heading from "~/components/common/Heading";
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
      {/* <Heading look="ds-label-01-bold" tagName="h2" text={heading} /> */}
      <h2 className="kern-title">{heading}</h2>
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
