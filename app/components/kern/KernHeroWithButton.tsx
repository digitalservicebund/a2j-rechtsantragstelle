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
}>;

export default function KernHeroWithButton({
  heading,
  content,
  button,
}: Props) {
  return (
    <GridItem
      smColumn={{ start: 1, span: 12 }}
      mdColumn={{ start: 1, span: 7 }}
      lgColumn={{ start: 3, span: 7 }}
      xlColumn={{ start: 3, span: 7 }}
      className="flex flex-col bg-kern-neutral-050 gap-kern-space-medium"
    >
      <Heading {...heading} />
      {content && (
        <RichText className="kern-heading-medium" html={content.html} />
      )}
      {button && (
        <ButtonContainer>
          <Button {...button} />
        </ButtonContainer>
      )}
    </GridItem>
  );
}
