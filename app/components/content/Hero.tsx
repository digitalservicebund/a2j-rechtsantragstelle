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
      span={12}
      mdSpan={7}
      mdStart={1}
      lgStart={3}
      lgSpan={7}
      xlStart={3}
      xlSpan={7}
      className={classNames(
        outerBackground?.backgroundColor === "darkBlue" ? "text-white" : "",
      )}
    >
      <Heading {...heading} />
      {content && (
        <RichText className="ds-heading-03-reg" html={content.html} />
      )}
      {button && (
        <ButtonContainer className="pb-64 sm:pt-24 text-white">
          <Button {...button} />
        </ButtonContainer>
      )}
    </GridItem>
  );
}
