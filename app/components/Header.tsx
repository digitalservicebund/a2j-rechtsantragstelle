import Heading, { type HeadingProps } from "./Heading";
import RichText, { type RichTextProps } from "./RichText";

type HeaderProps = Readonly<{
  heading: HeadingProps;
  content?: RichTextProps;
}>;

export default function Header({ heading, content }: HeaderProps) {
  return (
    <div className="ds-stack ds-stack-16">
      <Heading {...heading} />
      {content && (
        <RichText className="ds-heading-03-reg" html={content.html} />
      )}
    </div>
  );
}
