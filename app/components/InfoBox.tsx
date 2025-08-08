import classNames from "classnames";
import Heading, { type HeadingProps } from "./Heading";
import InfoBoxItem, { type InfoBoxItemProps } from "./InfoBoxItem";
import { GridContainer, GridItem } from ".";

type InfoBoxProps = {
  identifier?: string;
  heading?: HeadingProps;
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
    <GridContainer
      columns={12}
      maxWidth="xl"
      alignItems="start"
      paddingX="sm"
      justifyContent="start"
    >
      <GridItem span={12} colStart={1} className="px-32 py-32">
        <div className="ds-stack ds-stack-8 scroll-my-40" id={identifier}>
          {heading && <Heading {...heading} />}
          {items.length > 0 && (
            <div
              className={classNames("ps-0 info-box ds-stack", {
                "ds-stack-48": !separator,
                "ds-stack-32": separator,
              })}
              data-testid="info-box-item-container"
            >
              {items.map((item) => (
                <InfoBoxItem
                  separator={separator}
                  {...item}
                  key={
                    item.identifier ??
                    item.headline?.text ??
                    item.content ??
                    item.label?.text ??
                    ""
                  }
                />
              ))}
            </div>
          )}
        </div>
      </GridItem>
    </GridContainer>
  );
};

export default InfoBox;
