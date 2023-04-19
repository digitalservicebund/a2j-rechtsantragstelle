import InfoBoxItem from "~/components/InfoBoxItem";
import type { HeadingProps } from "./Heading";
import Heading from "./Heading";
import Container from "./Container";

export interface InfoBoxProps extends React.ClassAttributes<HTMLDivElement> {
  items: any[];
  headline: HeadingProps;
  className?: string;
  style?: string;
}

const InfoBox = ({ items, headline, style, ...props }: InfoBoxProps) => {
  let backgroundColor = "bg-white";
  switch (style) {
    case "blue":
      backgroundColor = "bg-blue-100";
      break;
    case "yellow":
      backgroundColor = "bg-yellow-300";
      break;
  }

  const containerProps = {
    ...props,
    className: `${backgroundColor} ${props.className || ""}`.trim(),
  };

  console.log(style + " " + backgroundColor);

  return (
    <Container {...containerProps}>
      <Heading {...headline} className="my-8" />
      <ul className="list-none ds-stack stack-32 ps-0 info-box mt-32 mb-40">
        {items.map((item, index) => (
          <InfoBoxItem {...item} key={index} />
        ))}
      </ul>
    </Container>
  );
};

export default InfoBox;
