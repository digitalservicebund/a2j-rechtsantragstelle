import CheckCircleIcon from "@digitalservicebund/icons/CheckCircle";
import { useEffect, useRef } from "react";
import { useFeedbackTranslations } from "./feedbackTranslations";
import Heading from "../Heading";
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
      <div className="flex items-center text-base font-bold mb-[1em]">
        <CheckCircleIcon className="w-[2em] h-[1.5em] mr-[0.25em] text-green-600 " />
        <Heading
          look="ds-label-01-bold"
          tagName="h2"
          text={feedbackTranslations["heading-post-submission"]}
          role="status"
          tabIndex={-1}
          innerRef={headingReference}
        />
      </div>
      <RichText markdown={feedbackTranslations["text-post-submission"]} />
    </div>
  );
};
