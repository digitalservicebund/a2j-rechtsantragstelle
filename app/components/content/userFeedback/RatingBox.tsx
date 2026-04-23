import ThumbDownIcon from "@digitalservicebund/icons/ThumbDownOutlined";
import ThumbUpIcon from "@digitalservicebund/icons/ThumbUpOutlined";
import { useFetcher } from "react-router";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { useFeedbackTranslations } from "./feedbackTranslations";
import { type FeedbackType } from "./FeedbackType";
import KernButtonContainer from "~/components/kern/KernButtonContainer";
import KernButton from "~/components/kern/KernButton";
import KernHeading from "~/components/kern/KernHeading";

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
      <KernHeading tagName="h2" text={heading} />
      <ratingFetcher.Form
        method="post"
        action={`/action/send-rating?url=${url}&js=${String(jsAvailable)}`}
        preventScrollReset={true}
      >
        <KernButtonContainer>
          <KernButton
            iconLeft={<ThumbUpIcon />}
            look={"tertiary"}
            name={userRatingFieldname}
            value="yes"
            type="submit"
            onClick={() => {
              onSubmit("positive");
            }}
            aria-label={`${heading}, ${feedbackTranslations["yes-rating"]}`}
          >
            {feedbackTranslations["yes-rating"]}
          </KernButton>
          <KernButton
            iconLeft={<ThumbDownIcon />}
            look={"tertiary"}
            name={userRatingFieldname}
            value="no"
            type="submit"
            onClick={() => {
              onSubmit("negative");
            }}
            aria-label={`${heading}, ${feedbackTranslations["no-rating"]}`}
          >
            {feedbackTranslations["no-rating"]}
          </KernButton>
        </KernButtonContainer>
      </ratingFetcher.Form>
    </>
  );
};
