import { getTranslationByKey } from "~/util/getTranslationByKey";
import { useFeedbackTranslations } from "./FeedbackTranslationContext";
import Heading from "../Heading";
import RichText from "../RichText";

export const HEADING_POST_SUBMISSION_TRANSLATION_KEY =
  "heading-post-submission";
export const TEXT_POST_SUBMISSION_TRANSLATION_KEY = "text-post-submission";

export const PostSubmissionBox = () => {
  const { translations } = useFeedbackTranslations();

  const heading = getTranslationByKey(
    HEADING_POST_SUBMISSION_TRANSLATION_KEY,
    translations,
  );
  const text = getTranslationByKey(
    TEXT_POST_SUBMISSION_TRANSLATION_KEY,
    translations,
  );

  return (
    <div data-testid="user-feedback-submission">
      <Heading
        look="ds-label-01-bold"
        tagName="h2"
        text={heading}
        role="status"
      />
      <RichText markdown={text} />
    </div>
  );
};
