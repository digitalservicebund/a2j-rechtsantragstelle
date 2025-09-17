import classNames from "classnames";
import type { ButtonProps } from "~/components/common/Button";
import Button from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import Heading, { type HeadingProps } from "~/components/common/Heading";
import RichText, { type RichTextProps } from "~/components/common/RichText";
import { GridItem } from "~/components/layout/grid/GridItem";

type Props = Readonly<{
  heading: HeadingProps;
  content?: RichTextProps;
  button?: ButtonProps;
  outerBackground?: {
    backgroundColor?: string;
    paddingTop?: string;
    paddingBottom?: string;
  };
}>;

export default function Hero({
  heading,
  content,
  button,
  outerBackground,
}: Props) {
  return (
    <GridItem
      smColumn={{ start: 1, span: 12 }}
      mdColumn={{ start: 1, span: 7 }}
      lgColumn={{ start: 3, span: 7 }}
      xlColumn={{ start: 3, span: 7 }}
      className={classNames(
        outerBackground?.backgroundColor === "darkBlue" ? "text-white" : "",
        "pt-40 pb-40",
      )}
    >
      <Heading {...heading} />
      {content && (
        <RichText className="ds-heading-03-reg" html={content.html} />
      )}
      {button && (
        <ButtonContainer className="pb-64 pt-24">
          <Button {...button} />
        </ButtonContainer>
      )}
    </GridItem>
  );
}
