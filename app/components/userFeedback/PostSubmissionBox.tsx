import { useEffect, useRef } from "react";
import { FeedbackTitle } from "~/components/userFeedback/FeedbackFormBox";
import { useFeedbackTranslations } from "~/components/userFeedback/feedbackTranslations";
import RichText from "../RichText";

type Props = {
  readonly shouldFocus: boolean;
};

export const PostSubmissionBox = ({ shouldFocus }: Props) => {
  const feedbackTranslations = useFeedbackTranslations();
  const headingReference = useRef<HTMLHeadingElement | null>(null);

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
      <RichText markdown={feedbackTranslations["text-post-submission"]} />
    </div>
  );
};
