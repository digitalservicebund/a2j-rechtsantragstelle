import classNames from "classnames";
import Heading, { type HeadingProps } from "~/components/common/Heading";
import { GridItem } from "~/components/layout/grid/GridItem";
import KernInfoBoxItem, { type KernInfoBoxItemProps } from "./KernInfoBoxItem";
import KernHeading from "./KernHeading";

export type KernInfoBoxProps = {
  identifier?: string;
  heading?: HeadingProps;
  items: KernInfoBoxItemProps[];
};

const KernInfoBox = ({ identifier, heading, items }: KernInfoBoxProps) => {
  return (
    <GridItem
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      className="gap-kern-space-small"
      id={identifier}
    >
      {heading && <h1 className="kern-heading-x-large">{heading.text}</h1>}
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
