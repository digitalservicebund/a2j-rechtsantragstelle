import Heading, { type HeadingProps } from "./Heading";
import RichText, { type RichTextProps } from "./RichText";

type Props = Readonly<{
  heading: HeadingProps;
  content?: RichTextProps;
}>;

export default function Hero({ heading, content }: Props) {
  return (
    <div className="container !pt-24 !pb-24 ds-stack ds-stack-16">
      <Heading {...heading} />
      {content && (
        <RichText className="ds-heading-03-reg" html={content.html} />
      )}
    </div>
  );
}
