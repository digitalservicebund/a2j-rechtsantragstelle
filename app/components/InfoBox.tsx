import type { InfoBoxItemProps } from "./InfoBoxItem";
import InfoBoxItem from "./InfoBoxItem";
import type { HeadingProps } from "./Heading";
import Heading from "./Heading";

export interface InfoBoxProps {
  items: InfoBoxItemProps[];
  heading?: HeadingProps;
}

const InfoBox = ({ items, heading }: InfoBoxProps) => {
  return (
    <div className="ds-stack-8">
      {heading && <Heading {...heading} />}
      <ul className="list-none ds-stack-32 ps-0 info-box">
        {items.map((item, index) => (
          <InfoBoxItem {...item} key={index} />
        ))}
      </ul>
    </div>
  );
};

export default InfoBox;
