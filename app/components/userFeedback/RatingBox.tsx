import ThumbDownIcon from "@digitalservicebund/icons/ThumbDownOutlined";
import ThumbUpIcon from "@digitalservicebund/icons/ThumbUpOutlined";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useFeedbackTranslations } from "./feedbackTranslations";
import Button from "../Button";
import ButtonContainer from "../ButtonContainer";
import Heading from "../Heading";

export const userRatingFieldname = "wasHelpful";

export type RatingBoxProps = {
  readonly heading: string;
  readonly url: string;
  readonly onSubmit: (positiveFeedback: boolean) => void;
};

export const RatingBox = ({ heading, url, onSubmit }: RatingBoxProps) => {
  const ratingFetcher = useFetcher();
  const [jsAvailable, setJsAvailable] = useState(false);
  const [positiveFeedback, setPositiveFeedback] = useState<boolean | null>(
    null,
  );
  useEffect(() => setJsAvailable(true), []);
  useEffect(() => {
    if (positiveFeedback !== null) {
      onSubmit(positiveFeedback);
    }
  }, [positiveFeedback, onSubmit]);

  const feedbackTranslations = useFeedbackTranslations();

  const handleFeedback = (isPositive: boolean) => {
    setPositiveFeedback(isPositive);
    onSubmit(isPositive);

    ratingFetcher.submit(
      { [userRatingFieldname]: isPositive ? "yes" : "no" },
      {
        method: "post",
        action: `/action/send-rating?url=${url}&js=${String(jsAvailable)}`,
      },
    );
  };

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
            look={positiveFeedback === true ? "primary" : "tertiary"}
            name={userRatingFieldname}
            value="yes"
            type="submit"
            onClick={() => {
              handleFeedback(true);
            }}
            aria-label={`${heading}, ${feedbackTranslations["yes-rating"]}`}
          >
            {feedbackTranslations["yes-rating"]}
          </Button>
          <Button
            iconLeft={<ThumbDownIcon />}
            look={positiveFeedback === true ? "primary" : "tertiary"}
            name={userRatingFieldname}
            value="no"
            type="submit"
            onClick={() => {
              handleFeedback(false);
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
