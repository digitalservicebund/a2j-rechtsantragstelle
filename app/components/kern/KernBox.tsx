import KernButton, { type ButtonProps } from "~/components/kern/KernButton";
import ButtonContainer from "~/components/common/ButtonContainer";
import KernHeading, {
  type KernHeadingProps,
} from "~/components/kern/KernHeading";
import KernRichText, {
  type RichTextProps,
} from "~/components/kern/KernRichText";
import { GridItem } from "~/components/layout/grid/GridItem";
import { arrayIsNonEmpty } from "~/util/array";
import KernLabel, { type KernLabelProps } from "./KernLabel";

type BoxProps = {
  identifier?: string;
  label?: KernLabelProps;
  heading?: KernHeadingProps;
  content?: RichTextProps;
  buttons?: ButtonProps[];
};

const KernBox = ({
  identifier,
  label,
  heading,
  content,
  buttons,
}: BoxProps) => {
  return (
    <GridItem
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
      className="py-32 px-16"
      id={identifier}
    >
      <div className="gap-kern-space-x-large flex flex-col ">
        <div className="kern-stack-sm">
          {label && <KernLabel {...label} />}
          {heading && <KernHeading {...heading} />}
          {content && (
            <div className="kern-text-container">
              <KernRichText {...content} />
            </div>
          )}
        </div>
        {arrayIsNonEmpty(buttons) && (
          <ButtonContainer className="kern-button-group pt-kern-space-small">
            {buttons.map((button) => (
              <KernButton key={button.text ?? button.href} {...button} />
            ))}
          </ButtonContainer>
        )}
      </div>
    </GridItem>
  );
};

export default KernBox;
