import ThumbDownIcon from "@digitalservicebund/icons/ThumbDownOutlined";
import ThumbUpIcon from "@digitalservicebund/icons/ThumbUpOutlined";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getTranslationByKey } from "~/util/getTranslationByKey";
import { useFeedbackTranslations } from "./FeedbackTranslationContext";
import Button from "../Button";
import ButtonContainer from "../ButtonContainer";
import Heading from "../Heading";

export const userRatingFieldname = "wasHelpful";
export const YES_RATING_BUTTON_LABEL_TRANSLATION_KEY = "yes-rating";
export const NO_RATING_BUTTON_LABEL_TRANSLATION_KEY = "no-rating";
const USER_FEEDBACK_RATING_BOX_ID = "user-feedback-rating-box";

export interface RatingBoxProps {
  readonly heading: string;
  readonly url: string;
}

export const RatingBox = ({ heading, url }: RatingBoxProps) => {
  const ratingFetcher = useFetcher();
  const [jsAvailable, setJsAvailable] = useState(false);
  useEffect(() => setJsAvailable(true), []);

  const { translations } = useFeedbackTranslations();

  const yesButtonLabel = getTranslationByKey(
    YES_RATING_BUTTON_LABEL_TRANSLATION_KEY,
    translations,
  );
  const noButtonLabel = getTranslationByKey(
    NO_RATING_BUTTON_LABEL_TRANSLATION_KEY,
    translations,
  );

  return (
    <>
      <Heading
        tagId={USER_FEEDBACK_RATING_BOX_ID}
        look="ds-label-01-bold"
        tagName="h2"
        text={heading}
      />
      <ratingFetcher.Form
        method="post"
        action={`/action/send-rating?url=${url}&js=${String(jsAvailable)}`}
        preventScrollReset={true}
      >
        <ButtonContainer>
          <Button
            iconLeft={<ThumbUpIcon />}
            look="tertiary"
            name={userRatingFieldname}
            value="yes"
            type="submit"
            aria-labelledby={USER_FEEDBACK_RATING_BOX_ID}
          >
            {yesButtonLabel}
          </Button>
          <Button
            iconLeft={<ThumbDownIcon />}
            look="tertiary"
            name={userRatingFieldname}
            value="no"
            type="submit"
            aria-labelledby={USER_FEEDBACK_RATING_BOX_ID}
          >
            {noButtonLabel}
          </Button>
        </ButtonContainer>
      </ratingFetcher.Form>
    </>
  );
};
