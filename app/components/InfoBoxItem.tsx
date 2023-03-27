import Heading from "./Heading";
import RichText from "./RichText";
import Image from "./Image";

type InfoBoxItemProps = {
  label?: string;
  headline: string;
  headlineLevel: 2 | 3 | 4 | 5 | 6;
  illustration?: any;
  content: string;
};

const InfoBoxItem = ({
  label,
  headline,
  headlineLevel = 3,
  illustration,
  content,
}: InfoBoxItemProps) => {
  return (
    <li>
      <Image image={illustration} />
      <div className="uppercase">{label}</div>
      <Heading level={headlineLevel} text={headline} />
      <RichText markdown={content} />
    </li>
  );
};

export default InfoBoxItem;
