import { type HeadingProps } from "~/components/common/Heading";
import { type RichTextProps } from "~/components/common/RichText";
import { GridItem } from "~/components/layout/grid/GridItem";
import KernHeading from "./KernHeading";

type Props = Readonly<{
  heading: HeadingProps;
  content?: RichTextProps;
}>;

export default function KernHero({ heading, content }: Props) {
  return (
    <GridItem
      smColumn={{ start: 1, span: 12 }}
      mdColumn={{ start: 1, span: 7 }}
      lgColumn={{ start: 3, span: 9 }}
      xlColumn={{ start: 3, span: 9 }}
      className="flex flex-col bg-kern-color-action gap-kern-space-default"
    >
      <KernHeading {...heading} className="text-white! p-0!" />
      {content && (
        <div
          className="kern-subline kern-subline--large text-white!"
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      )}
    </GridItem>
  );
}
