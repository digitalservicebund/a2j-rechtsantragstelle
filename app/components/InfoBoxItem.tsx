import classNames from "classnames";
import { arrayIsNonEmpty } from "~/util/array";
import Button, { type ButtonProps } from "./Button";
import ButtonContainer from "./ButtonContainer";
import { Details, type DetailsProps } from "./Details";
import Heading, { type HeadingProps } from "./Heading";
import Image, { type ImageProps } from "./Image";
import RichText from "./RichText";

export type InfoBoxItemProps = {
  identifier?: string;
  label?: HeadingProps;
  headline?: HeadingProps;
  image?: ImageProps;
  content?: string;
  details?: DetailsProps[];
  buttons?: ButtonProps[];
  separator?: boolean;
};

const InfoBoxItem = ({
  identifier,
  label,
  headline,
  image,
  content,
  details,
  buttons,
  separator,
}: InfoBoxItemProps) => {
  return (
    <li
      id={identifier}
      className={classNames(
        "flex flex-row items-center justify-center max-w-none max-[499px]:flex-col first:pt-0 scroll-my-40",
        {
          "pt-32 border-0 border-solid border-0 border-t-2 border-gray-400 first:border-none":
            separator,
        },
      )}
    >
      {image && (
        <Image
          {...image}
          className="max-[499px]:mb-16 max-[499px]:w-[144px] max-[499px]:h-[144px] h-[168px] w-[168px] self-baseline"
        />
      )}
      <div
        className={`ds-stack-16 break-words w-full ${
          image ? "min-[500px]:ml-16" : ""
        }`}
      >
        {label && <Heading {...label} />}
        {headline && <Heading {...headline} />}
        {content && <RichText markdown={content} />}
        {details &&
          details.map((details) => (
            <Details key={details.title} {...details} />
          ))}
        {arrayIsNonEmpty(buttons) && (
          <ButtonContainer>
            {buttons.map((button) => (
              <Button key={button.text ?? button.href} {...button} />
            ))}
          </ButtonContainer>
        )}
      </div>
    </li>
  );
};

export default InfoBoxItem;
