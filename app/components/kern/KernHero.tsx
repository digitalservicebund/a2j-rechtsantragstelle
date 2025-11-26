import Heading, { type HeadingProps } from "~/components/common/Heading";
import { type RichTextProps } from "~/components/common/RichText";
import { GridItem } from "~/components/layout/grid/GridItem";

type Props = Readonly<{
  heading: HeadingProps;
  content?: RichTextProps;
}>;

export default function KernHero({ heading, content }: Props) {
  return (
    <GridItem
      smColumn={{ start: 1, span: 12 }}
      mdColumn={{ start: 1, span: 7 }}
      lgColumn={{ start: 3, span: 7 }}
      xlColumn={{ start: 3, span: 7 }}
      className="flex flex-col bg-kern-color-action gap-kern-space-medium"
    >
      <Heading {...heading} className="text-white" />
      {content && (
        <h1 className="kern-heading-medium text-white">{content.html}</h1>
      )}
    </GridItem>
  );
}
