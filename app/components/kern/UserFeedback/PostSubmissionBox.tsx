import { useEffect, useRef } from "react";
import { useFeedbackTranslations } from "./feedbackTranslations";
import { FeedbackSuccessMessage } from "./FeedbackSuccessMessage";
import KernRichText from "../KernRichText";

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
