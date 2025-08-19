import classNames from "classnames";
import Accordion from "~/components/common/Accordion";
import Button from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import Heading from "~/components/common/Heading";
import Image, { type ImageProps } from "~/components/common/Image";
import RichText from "~/components/common/RichText";
import { arrayIsNonEmpty } from "~/util/array";
import type { ListVariant, ListItemProps, ListMarkerProps } from "./types";

const ImageMarker = ({ image }: { image: ImageProps }) => (
  <div className="flex items-start">
    <Image {...image} ariaHidden={true} />
  </div>
);

const StyledMarker = ({
  index,
  variant,
}: {
  index?: number;
  variant: ListVariant;
}) => (
  <div
    className={classNames("shrink-0 flex justify-center items-center", {
      "w-[16px] h-[2px] border border-black mt-[19.5px] ":
        variant === "unordered",
      "h-[40px] w-full border-2 border-gray-400 rounded-full":
        variant === "numbered",
      "h-[40px] w-full bg-blue-800 text-white rounded-full":
        variant === "stepByStep",
    })}
  >
    {variant === "unordered" ? null : index}
  </div>
);

const ListMarker = ({ index, variant, image }: ListMarkerProps) => {
  return image ? (
    <ImageMarker image={image} />
  ) : (
    <StyledMarker index={index} variant={variant} />
  );
};

const ListItem = ({
  identifier,
  headline,
  content,
  buttons,
  index,
  accordion,
  variant,
  image,
}: ListItemProps & { variant: ListVariant }) => {
  return (
    <div id={identifier} className="flex flex-row gap-16">
      <div className="text-center shrink-0 flex flex-col items-center w-[40px]">
        <ListMarker index={index} variant={variant} image={image} />
        {variant === "stepByStep" && (
          <div className="w-2 h-full group-last:hidden bg-blue-500"></div>
        )}
      </div>
      <div className="ds-stack ds-stack-24 pb-48 w-full">
        <div className="ds-stack ds-stack-8">
          {headline && <Heading {...headline} />}
          {content && <RichText html={content} />}
          {arrayIsNonEmpty(buttons) && (
            <ButtonContainer className="mt-16">
              {buttons.map((button) => (
                <Button key={button.text ?? button.href} {...button} />
              ))}
            </ButtonContainer>
          )}
        </div>
        {accordion && <Accordion {...accordion} />}
      </div>
    </div>
  );
};

export default ListItem;
