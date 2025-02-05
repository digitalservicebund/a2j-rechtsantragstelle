import { useEffect, useRef } from "react";
import { FeedbackTitle } from "~/components/userFeedback/FeedbackTitle";
import { useFeedbackTranslations } from "~/components/userFeedback/feedbackTranslations";
import RichText from "../RichText";

type Props = {
  readonly shouldFocus: boolean;
  readonly postSubmissionText?: string;
};

export const PostSubmissionBox = ({
  shouldFocus,
  postSubmissionText,
}: Props) => {
  const feedbackTranslations = useFeedbackTranslations();
  const headingReference = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (shouldFocus && headingReference.current) {
      headingReference.current.focus();
    }
  }, [shouldFocus]);

  return (
    <div data-testid="user-feedback-submission">
      <FeedbackTitle
        innerRef={headingReference}
        title={feedbackTranslations["success-message"]}
        subtitle={feedbackTranslations["feedback-helps"]}
      />
      {postSubmissionText && <RichText html={postSubmissionText} />}
    </div>
  );
};
