import { GridItem } from "~/components/layout/grid/GridItem";
import KernHeading, { type KernHeadingProps } from "./KernHeading";
import classNames from "classnames";
import KernButton, { type ButtonProps } from "./KernButton";
import { type RichTextProps } from "./KernRichText";

type Props = Readonly<{
  heading: KernHeadingProps;
  content?: RichTextProps;
  sectionBackgroundColor?: string;
  button?: ButtonProps;
}>;

export default function KernHero({
  heading,
  content,
  sectionBackgroundColor,
  button,
}: Props) {
  return (
    <GridItem
      mdColumn={{ start: 1, span: 7 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      className="flex flex-col gap-kern-space-default py-kern-space-x-large px-kern-space-large lg:px-0 xl:px-0"
    >
      <KernHeading
        {...heading}
        className={classNames({
          "text-white!": sectionBackgroundColor === "blue",
        })}
        managedByParent
      />
      {content && (
        <div
          className={classNames("text-kern-static-large font-medium", {
            "text-white!": sectionBackgroundColor === "blue",
          })}
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      )}
      {button && (
        <div>
          <KernButton {...button} />
        </div>
      )}
    </GridItem>
  );
}
