import InfoBoxItem from "~/components/InfoBoxItem";
import type { HeadingProps } from "./Heading";
import Heading from "./Heading";
import Container from "./Container";

export interface InfoBoxProps
  extends React.ClassAttributes<HTMLHeadingElement> {
  items: any[];
  headline: HeadingProps;
}

const InfoBox = ({ items, headline, ...props }: InfoBoxProps) => {
  return (
    <Container {...props}>
      <Heading {...headline} />
      <ul
        className="list-none ds-stack ps-0 info-box"
        style={{ "--stack-space": "var(--s-xl)" } as React.CSSProperties}
      >
        {items.map((item, index) => (
          <InfoBoxItem {...item} key={index} />
        ))}
      </ul>
    </Container>
  );
};

export default InfoBox;
