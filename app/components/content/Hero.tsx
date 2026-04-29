import classNames from "classnames";
import { GridItem } from "~/components/layout/grid/GridItem";
import KernButtonContainer from "../kern/KernButtonContainer";
import KernButton, { type ButtonProps } from "../kern/KernButton";
import KernHeading, { type KernHeadingProps } from "../kern/KernHeading";
import KernRichText, { type RichTextProps } from "../kern/KernRichText";

type Props = Readonly<{
  heading: KernHeadingProps;
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
      <KernHeading {...heading} />
      {content && (
        <KernRichText className="ds-heading-03-reg" html={content.html} />
      )}
      {button && (
        <KernButtonContainer className="pb-64 pt-24">
          <KernButton {...button} />
        </KernButtonContainer>
      )}
    </GridItem>
  );
}
