import Heading from "./Heading";
import RichText from "./RichText";
import type { ImageProps } from "./Image";
import Image from "./Image";
import type { ButtonLinkProps } from "./Button";
import Button from "./Button";

type InfoBoxItemProps = {
  label?: string;
  headline?: string;
  image?: ImageProps;
  content: string;
  button?: ButtonLinkProps;
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
            className:
              "max-[499px]:mb-24 max-[499px]:w-[80px] max-[499px]:self-start w-[176px]",
          }}
        />
      )}
      <div
        className={
          "ds-stack stack-8 break-words w-full " +
          (image?.data && "min-[500px]:ml-24")
        }
      >
        {label && <div className="ds-label-02-bold">{label}</div>}
        {headline && (
          <Heading text={headline} level={2} style="ds-heading-03-reg" />
        )}
        {content && <RichText markdown={content} />}
        {button && <Button className="max-w-fit" {...button} />}
      </div>
    </li>
  );
};

export default InfoBoxItem;
