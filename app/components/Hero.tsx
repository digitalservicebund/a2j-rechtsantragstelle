import { GridContainer } from ".";
import type { ButtonProps } from "./Button";
import Button from "./Button";
import ButtonContainer from "./ButtonContainer";
import Heading, { type HeadingProps } from "./Heading";
import RichText, { type RichTextProps } from "./RichText";

type Props = Readonly<{
  heading: HeadingProps;
  content?: RichTextProps;
  button?: ButtonProps;
}>;

export default function Hero({ heading, content, button }: Props) {
  return (
    <div className="!pt-24 !pb-24 ds-stack ds-stack-16">
      <GridContainer
        columns={1}
        maxWidth="lg"
        alignItems="start"
        paddingX="sm"
        justifyContent="start"
      >
        <Heading {...heading} />
        {content && (
          <RichText className="ds-heading-03-reg" html={content.html} />
        )}
        {button && (
          <ButtonContainer className="pb-64 sm:pt-24">
            <Button {...button} />
          </ButtonContainer>
        )}
      </GridContainer>
    </div>
  );
}
