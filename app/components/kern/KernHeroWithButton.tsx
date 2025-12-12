import type { ButtonProps } from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import { GridItem } from "~/components/layout/grid/GridItem";
import { type RichTextProps } from "../common/RichText";
import KernHeading from "./KernHeading";
import { type HeadingProps } from "../common/Heading";
import KernButton from "./KernButton";
import KernRichText from "./KernRichText";

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
      className="gap-kern-space-x-large flex flex-col"
    >
      <KernHeading {...heading} className="text-black!" />
      {content && (
        <KernRichText
          className="kern-heading-medium text-black!"
          html={content.html}
        />
      )}
      {button && (
        <ButtonContainer>
          <KernButton {...button} />
        </ButtonContainer>
      )}
    </GridItem>
  );
}
