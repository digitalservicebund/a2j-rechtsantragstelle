import type { ButtonProps } from "./Button";
import Button from "./Button";
import ButtonContainer from "./ButtonContainer";
import Heading from "./Heading";
import RichText from "./RichText";

type Props = Readonly<{
  title: string;
  subTitleHtml?: string;
  button?: ButtonProps;
}>;

export default function Hero({ title, button, subTitleHtml }: Props) {
  return (
    <div className="container !pt-24 !pb-24 ds-stack ds-stack-16">
      <Heading look="ds-heading-01-reg" tagName="h1" text={title} />
      {subTitleHtml && (
        <RichText className="ds-heading-03-reg" html={subTitleHtml} />
      )}
      {button && (
        <ButtonContainer className="pb-64 sm:pt-24">
          <Button {...button} />
        </ButtonContainer>
      )}
    </div>
  );
}
