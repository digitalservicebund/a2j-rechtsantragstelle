import ThumbDownIcon from "@digitalservicebund/icons/ThumbDownOutlined";
import ThumbUpIcon from "@digitalservicebund/icons/ThumbUpOutlined";
import { useFetcher } from "react-router";
import { useJsAvailable } from "~/services/useJsAvailable";
import { FeedbackType } from "./FeedbackType";
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
  const jsAvailable = useJsAvailable();
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
            aria-label={`${heading}, Ja`}
          >
            Ja
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
            aria-label={`${heading}, Nein`}
          >
            Nein
          </Button>
        </ButtonContainer>
      </ratingFetcher.Form>
    </>
  );
};
