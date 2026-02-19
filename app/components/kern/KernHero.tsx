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
      mdColumn={{ start: 1, span: 7 }}
      lgColumn={{ start: 3, span: 9 }}
      xlColumn={{ start: 3, span: 9 }}
      className="flex flex-col gap-kern-space-default py-kern-space-x-large"
    >
      <KernHeading {...heading} className="text-white! p-0!" />
      {content && (
        <div
          className="text-kern-layout-text-inverse text-kern-static-large"
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      )}
    </GridItem>
  );
}
