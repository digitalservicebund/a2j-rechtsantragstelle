import Heading, { type HeadingProps } from "./Heading";
import RichText, { type RichTextProps } from "./RichText";

type Props = Readonly<{
  heading: HeadingProps;
  content?: RichTextProps;
}>;

export default function Hero({ heading, content }: Props) {
  return (
    <div className="ds-stack ds-stack-16">
      <Heading {...heading} />
      {content && (
        <RichText className="ds-heading-03-reg" html={content.html} />
      )}
    </div>
  );
}
