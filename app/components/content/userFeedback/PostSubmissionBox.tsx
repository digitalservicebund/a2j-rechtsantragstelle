import { useEffect, useRef } from "react";
import { FeedbackSuccessMessage } from "~/components/content/userFeedback/FeedbackSuccessMessage";
import { useFeedbackTranslations } from "~/components/content/userFeedback/feedbackTranslations";
import KernRichText from "~/components/kern/KernRichText";

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
      <FeedbackSuccessMessage
        innerRef={headingReference}
        subtitle={feedbackTranslations["feedback-helps"]}
      />
      {postSubmissionText && <KernRichText html={postSubmissionText} />}
    </div>
  );
};
