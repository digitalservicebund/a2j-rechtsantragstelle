import type { ButtonProps } from "~/components/common/Button";
import cx from "classnames";
import Button from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import Heading, { type HeadingProps } from "~/components/common/Heading";
import RichText, { type RichTextProps } from "~/components/common/RichText";
import GridContainer from "~/components/GridContainer";
import { GridItem } from "../GridItem";
import { BACKGROUND_COLORS } from "../index";
import { Section } from "../Section";
import { ContentGrid } from "../ContentGrid";

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
    <ContentGrid className="py-64">
      <GridItem
        span={12}
        mdSpan={7}
        mdStart={1}
        lgStart={3}
        lgSpan={8}
        xlStart={3}
        xlSpan={8}
        className={cx(
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
    </ContentGrid>
  );
}
