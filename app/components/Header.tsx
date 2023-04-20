import type { HeadingProps } from "./Heading";
import Heading from "./Heading";
import type { ParagraphProps } from "./Paragraph";
import Paragraph from "./Paragraph";

export interface HeaderProps {
  heading: HeadingProps;
  content: ParagraphProps;
}

export default function Header({ heading, content }: HeaderProps) {
  return (
    <div className="ds-stack stack-16">
      <Heading {...heading} />
      {content && (
        <div className="ds-heading-03-reg">
          <Paragraph {...content} />
        </div>
      )}
    </div>
  );
}
