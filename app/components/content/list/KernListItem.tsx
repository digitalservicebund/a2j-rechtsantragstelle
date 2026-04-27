import classNames from "classnames";
import ButtonContainer from "~/components/common/ButtonContainer";
import Image, { type ImageProps } from "~/components/common/Image";
import { arrayIsNonEmpty } from "~/util/array";
import {
  type ListItemProps,
  type ListMarkerProps,
  type ListVariant,
} from "./types";
import KernButton from "../../kern/KernButton";
import KernHeading from "../../kern/KernHeading";
import KernRichText from "../../kern/KernRichText";
import KernAccordion from "../../kern/KernAccordion";

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
      "w-[16px] h-[2px] border border-black mt-[16px] text-black text-black! forced-color-adjust-auto ":
        variant === "unordered",
      "h-[40px] w-full border-2 border-kern-neutral-300 rounded-full text-black! forced-color-adjust-auto":
        variant === "numbered",
      "h-[40px] w-full border-2 border-kern-neutral-300 text-white rounded-full text-black! forced-color-adjust-auto":
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

const KernListItem = ({
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
    <div id={identifier} className="flex flex-row gap-kern-space-default pb-48">
      <div className="text-center shrink-0 flex flex-col items-center w-[40px]">
        <ListMarker index={index} variant={variant} image={image} />
        {variant === "stepByStep" && (
          <div className="w-2 h-full group-last:hidden"></div>
        )}
      </div>
      <div className="gap-kern-space-x-large">
        {headline && (
          <KernHeading
            {...headline}
            className="text-kern-static-large!"
            managedByParent
          />
        )}
        {content && <KernRichText className="pt-8!" html={content} />}
        {arrayIsNonEmpty(buttons) && (
          <ButtonContainer className="mt-16">
            {buttons.map((button) => (
              <KernButton key={button.text ?? button.href} {...button} />
            ))}
          </ButtonContainer>
        )}

        {accordion && (
          <div className="pt-kern-space-x-large">
            <KernAccordion {...accordion} />
          </div>
        )}
      </div>
    </div>
  );
};

export default KernListItem;
