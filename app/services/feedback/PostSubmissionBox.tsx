import Heading from "~/components/Heading";
import RichText from "~/components/RichText";

export interface PostSubmissionBoxProps {
  heading: string;
  text: string;
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
