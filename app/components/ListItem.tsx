import classNames from "classnames";
import Accordion, { AccordionProps } from "~/components/Accordion";
import { arrayIsNonEmpty } from "~/util/array";
import Button, { type ButtonProps } from "./Button";
import ButtonContainer from "./ButtonContainer";
import Heading, { type HeadingProps } from "./Heading";
import type { ListVariant } from "./List";
import RichText from "./RichText";

export type ListItemProps = {
  identifier?: string;
  headline?: HeadingProps;
  content?: string;
  buttons?: ButtonProps[];
  index?: number;
  accordion?: AccordionProps;
};

const ListIcon = ({
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

const ListItem = ({
  identifier,
  headline,
  content,
  buttons,
  index,
  accordion,
  variant,
}: ListItemProps & { variant: ListVariant }) => {
  return (
    <div id={identifier} className="flex flex-row gap-16">
      <div className="text-center shrink-0 flex flex-col items-center w-[40px]">
        <ListIcon index={index} variant={variant} />
        {variant === "stepByStep" && (
          <div className="w-2 h-full group-last:hidden bg-blue-500"></div>
        )}
      </div>
      <div className="ds-stack ds-stack-24 pb-48">
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
