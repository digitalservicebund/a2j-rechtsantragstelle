import { type HeadingProps } from "~/components/common/Heading";
import { type RichTextProps } from "~/components/common/RichText";
import { GridItem } from "~/components/layout/grid/GridItem";
import KernHeading from "./KernHeading";
import classNames from "classnames";

type Props = Readonly<{
  heading: HeadingProps;
  content?: RichTextProps;
  sectionBackgroundColor?: string;
}>;

export default function KernHero({
  heading,
  content,
  sectionBackgroundColor,
}: Props) {
  return (
    <GridItem
      mdColumn={{ start: 1, span: 7 }}
      lgColumn={{ start: 3, span: 9 }}
      xlColumn={{ start: 3, span: 9 }}
      className="flex flex-col gap-kern-space-default py-kern-space-x-large px-kern-space-default"
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
          className={classNames("text-kern-static-large", {
            "text-white!": sectionBackgroundColor === "blue",
          })}
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      )}
    </GridItem>
  );
}
