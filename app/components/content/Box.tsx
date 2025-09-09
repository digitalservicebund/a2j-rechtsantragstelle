import Button, { type ButtonProps } from "~/components/common/Button";
import cx from "classnames";
import ButtonContainer from "~/components/common/ButtonContainer";
import Heading, { type HeadingProps } from "~/components/common/Heading";
import RichText, { type RichTextProps } from "~/components/common/RichText";
import { arrayIsNonEmpty } from "~/util/array";
import GridContainer from "../GridContainer";
import { GridItem } from "../GridItem";
import { BACKGROUND_COLORS } from "..";
import { Section } from "../Section";
import { ContentGrid } from "../ContentGrid";

type BoxProps = {
  identifier?: string;
  label?: HeadingProps;
  heading?: HeadingProps;
  content?: RichTextProps;
  buttons?: ButtonProps[];
  container?: {
    backgroundColor?: string;
  };
};

const Box = ({
  identifier,
  label,
  heading,
  content,
  buttons,
  container,
}: BoxProps) => {
  return (
    <ContentGrid
      className="py-40"
      background={{
        start: 1,
        span: 12,
        mdStart: 1,
        mdSpan: 8,
        lgStart: 2,
        lgSpan: 10,
        xlStart: 2,
        xlSpan: 10,
        className: cx(
          BACKGROUND_COLORS[
            container?.backgroundColor as keyof typeof BACKGROUND_COLORS
          ],
          "rounded-lg",
        ),
      }}
    >
      <GridItem
        span={12}
        mdSpan={7}
        mdStart={1}
        lgStart={3}
        lgSpan={7}
        xlStart={3}
        xlSpan={7}
        id={identifier}
        className="[grid-row:1] z-10 pt-32 pb-32"
      >
        <div className="ds-stack ds-stack-8 px-16">
          {label && <Heading {...label} />}
          {heading && <Heading {...heading} />}
          {content && (
            <div>
              <RichText {...content} />
            </div>
          )}
        </div>
        {arrayIsNonEmpty(buttons) && (
          <ButtonContainer className="px-16">
            {buttons.map((button) => (
              <Button key={button.text ?? button.href} {...button} />
            ))}
          </ButtonContainer>
        )}
      </GridItem>
    </ContentGrid>
  );
};

export default Box;
