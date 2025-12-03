import type { ButtonProps } from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import Heading, { type HeadingProps } from "~/components/common/Heading";
import { GridItem } from "~/components/layout/grid/GridItem";
import Button from "~/components/common/Button";
import RichText, { RichTextProps } from "../common/RichText";

type Props = Readonly<{
  heading: HeadingProps;
  content?: RichTextProps;
  button?: ButtonProps;
}>;

export default function HeroWithButton({ heading, content, button }: Props) {
  return (
    <GridItem
      smColumn={{ start: 1, span: 12 }}
      mdColumn={{ start: 1, span: 7 }}
      lgColumn={{ start: 3, span: 7 }}
      xlColumn={{ start: 3, span: 7 }}
      className="gap-kern-space-x-large flex flex-col bg-kern-neutral-050"
    >
      <Heading {...heading} />
      {content && (
        <RichText
          className="kern-heading-medium !text-black"
          html={content.html}
        />
      )}
      {button && (
        <ButtonContainer>
          <Button {...button} />
        </ButtonContainer>
      )}
    </GridItem>
  );
}
