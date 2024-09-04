import { useEffect, useRef } from "react";
import { getTranslationByKey } from "~/util/getTranslationByKey";
import { useFeedbackTranslations } from "./FeedbackTranslationContext";
import Heading from "../Heading";
import RichText from "../RichText";

export const HEADING_POST_SUBMISSION_TRANSLATION_KEY =
  "heading-post-submission";
export const TEXT_POST_SUBMISSION_TRANSLATION_KEY = "text-post-submission";

interface Props {
  readonly shouldFocus: boolean;
}

export const PostSubmissionBox = ({ shouldFocus }: Props) => {
  const { translations } = useFeedbackTranslations();
  const headingReference = useRef<HTMLHeadingElement | null>(null);

  const heading = getTranslationByKey(
    HEADING_POST_SUBMISSION_TRANSLATION_KEY,
    translations,
  );
  const text = getTranslationByKey(
    TEXT_POST_SUBMISSION_TRANSLATION_KEY,
    translations,
  );

  useEffect(() => {
    if (shouldFocus && headingReference !== null && headingReference.current) {
      headingReference.current.focus();
    }
  }, [shouldFocus]);

  return (
    <div data-testid="user-feedback-submission">
      <Heading
        look="ds-label-01-bold"
        tagName="h2"
        text={heading}
        role="status"
        tabIndex={-1}
        innerRef={headingReference}
      />
      <RichText markdown={text} />
    </div>
  );
};
