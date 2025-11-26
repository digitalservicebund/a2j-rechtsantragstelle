import classNames from "classnames";
import Heading, { type HeadingProps } from "~/components/common/Heading";
import { GridItem } from "~/components/layout/grid/GridItem";
import KernInfoBoxItem, { type KernInfoBoxItemProps } from "./KernInfoBoxItem";

export type KernInfoBoxProps = {
  identifier?: string;
  heading?: HeadingProps;
  separator?: boolean;
  items: KernInfoBoxItemProps[];
};

const KernInfoBox = ({
  identifier,
  heading,
  separator = true,
  items,
}: KernInfoBoxProps) => {
  return (
    <GridItem
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      className="gap-kern-space-small"
      id={identifier}
    >
      {heading && <Heading {...heading} />}
      {items.length > 0 && (
        <div
          // className={classNames("ps-0 info-box ds-stack py-24", {
          //   "ds-stack-48": !separator,
          //   "ds-stack-32": separator,
          // })}
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
