import ThumbDownIcon from "@digitalservicebund/icons/ThumbDownOutlined";
import ThumbUpIcon from "@digitalservicebund/icons/ThumbUpOutlined";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { FeedbackType } from "~/components/userFeedback";
import { useFeedbackTranslations } from "./feedbackTranslations";
import Button from "../Button";
import ButtonContainer from "../ButtonContainer";
import Heading from "../Heading";

export const userRatingFieldname = "wasHelpful";

export type RatingBoxProps = {
  readonly heading: string;
  readonly url: string;
  readonly onSubmit: (feedback: FeedbackType) => void;
};

export const RatingBox = ({ heading, url, onSubmit }: RatingBoxProps) => {
  const ratingFetcher = useFetcher();
  const [jsAvailable, setJsAvailable] = useState(false);
  useEffect(() => setJsAvailable(true), []);

  const feedbackTranslations = useFeedbackTranslations();
  return (
    <>
      <Heading look="ds-label-01-bold" tagName="h2" text={heading} />
      <ratingFetcher.Form
        method="post"
        action={`/action/send-rating?url=${url}&js=${String(jsAvailable)}`}
        preventScrollReset={true}
      >
        <ButtonContainer>
          <Button
            iconLeft={<ThumbUpIcon />}
            look={"tertiary"}
            name={userRatingFieldname}
            value="yes"
            type="submit"
            onClick={() => {
              onSubmit(FeedbackType.Positive);
            }}
            aria-label={`${heading}, ${feedbackTranslations["yes-rating"]}`}
          >
            {feedbackTranslations["yes-rating"]}
          </Button>
          <Button
            iconLeft={<ThumbDownIcon />}
            look={"tertiary"}
            name={userRatingFieldname}
            value="no"
            type="submit"
            onClick={() => {
              onSubmit(FeedbackType.Negative);
            }}
            aria-label={`${heading}, ${feedbackTranslations["no-rating"]}`}
          >
            {feedbackTranslations["no-rating"]}
          </Button>
        </ButtonContainer>
      </ratingFetcher.Form>
    </>
  );
};
