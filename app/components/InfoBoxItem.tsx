import type { HeadingProps } from "./Heading";
import Heading from "./Heading";
import RichText from "./RichText";
import type { ImageProps } from "./Image";
import Image from "./Image";
import type { ButtonLinkProps } from "./Button";
import Button from "./Button";

export type InfoBoxItemProps = {
  label?: HeadingProps | null;
  headline?: HeadingProps | null;
  image?: ImageProps;
  content?: string;
  button?: ButtonLinkProps | null;
};

const InfoBoxItem = ({
  label,
  headline,
  image,
  content,
  button,
}: InfoBoxItemProps) => {
  return (
    <li className="flex flex-row items-center justify-center max-w-none max-[499px]:flex-col pt-32 border-solid border-0 border-t-2 border-gray-400 first:border-none first:pt-0">
      {image?.data && (
        <Image
          {...image}
          {...{
            className: "max-[499px]:mb-16 w-[48px] h-[48px] self-baseline",
          }}
        />
      )}
      <div
        className={
          "ds-stack-8 break-words w-full " +
          (image?.data && "min-[500px]:ml-16")
        }
      >
        {label && <Heading {...label} />}
        {headline && <Heading {...headline} />}
        {content && <RichText markdown={content} />}
        {button && <Button className="max-w-fit mt-16 mb-0" {...button} />}
      </div>
    </li>
  );
};

export default InfoBoxItem;
