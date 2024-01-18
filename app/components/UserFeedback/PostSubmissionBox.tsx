import Heading from "../Heading";
import RichText from "../RichText";

export interface PostSubmissionBoxProps {
  readonly heading: string;
  readonly text: string;
}

export const PostSubmissionBox = ({
  heading,
  text,
}: PostSubmissionBoxProps) => (
  <div data-testid="user-feedback-submission">
    <Heading look="ds-label-01-bold" tagName="h2" text={heading} />
    <RichText markdown={text} />
  </div>
);
