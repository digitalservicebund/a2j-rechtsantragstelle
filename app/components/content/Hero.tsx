import type { ButtonProps } from "~/components/common/Button";
import Button from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import Heading, { type HeadingProps } from "~/components/common/Heading";
import RichText, { type RichTextProps } from "~/components/RichText";

type Props = Readonly<{
  heading: HeadingProps;
  content?: RichTextProps;
  button?: ButtonProps;
}>;

export default function Hero({ heading, content, button }: Props) {
  return (
    <div className="container !pt-24 !pb-24 ds-stack ds-stack-16">
      <Heading {...heading} />
      {content && (
        <RichText className="ds-heading-03-reg" html={content.html} />
      )}
      {button && (
        <ButtonContainer className="pb-64 sm:pt-24">
          <Button {...button} />
        </ButtonContainer>
      )}
    </div>
  );
}
