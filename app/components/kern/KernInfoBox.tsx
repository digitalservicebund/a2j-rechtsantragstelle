import { GridItem } from "~/components/layout/grid/GridItem";
import KernInfoBoxItem, { type KernInfoBoxItemProps } from "./KernInfoBoxItem";
import KernHeading, { KernHeadingProps } from "./KernHeading";

export type KernInfoBoxProps = {
  identifier?: string;
  heading?: KernHeadingProps;
  items: KernInfoBoxItemProps[];
};

const KernInfoBox = ({ identifier, heading, items }: KernInfoBoxProps) => {
  return (
    <GridItem
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      className="flex flex-col gap-kern-space-x-large"
      id={identifier}
    >
      {heading && <KernHeading text={heading.text} />}
      {items.length > 0 && (
        <div
          className="flex flex-col justify-start align-start gap-kern-space-x-large"
          data-testid="info-box-item-container"
        >
          {items.map((item) => (
            <KernInfoBoxItem key={item.id} {...item} />
          ))}
        </div>
      )}
    </GridItem>
  );
};

export default KernInfoBox;
