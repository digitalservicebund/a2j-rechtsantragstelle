import Heading from "./Heading";
import RichText from "./RichText";
import type { ImageProps } from "./Image";
import Image from "./Image";

type InfoBoxItemProps = {
  label?: string;
  headline: string;
  image: ImageProps;
  content: string;
};

const InfoBoxItem = ({ label, headline, image, content }: InfoBoxItemProps) => {
  return (
    <li>
      <Image {...image} />
      {label && <div className="uppercase">{label}</div>}
      <Heading text={headline} level={2} />
      <RichText markdown={content} />
    </li>
  );
};

export default InfoBoxItem;
