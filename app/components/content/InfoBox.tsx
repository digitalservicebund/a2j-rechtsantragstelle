import classNames from "classnames";
import { GridItem } from "~/components/layout/grid/GridItem";
import InfoBoxItem, { type InfoBoxItemProps } from "./InfoBoxItem";
import KernHeading, { type KernHeadingProps } from "../kern/KernHeading";

export type InfoBoxProps = {
  identifier?: string;
  heading?: KernHeadingProps;
  separator?: boolean;
  items: InfoBoxItemProps[];
};

const InfoBox = ({
  identifier,
  heading,
  separator = true,
  items,
}: InfoBoxProps) => {
  return (
    <GridItem
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      className="py-24 px-16 md:px-16 lg:px-0 xl:px-0"
      id={identifier}
    >
      {heading && <KernHeading {...heading} />}
      {items.length > 0 && (
        <div
          className={classNames("ps-0 info-box ds-stack py-24", {
            "ds-stack-48": !separator,
            "ds-stack-32": separator,
          })}
          data-testid="info-box-item-container"
        >
          {items.map((item) => (
            <InfoBoxItem separator={separator} key={item.id} {...item} />
          ))}
        </div>
      )}
    </GridItem>
  );
};

export default InfoBox;
