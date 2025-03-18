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

const iconClassnames = {
  unordered:
    "w-[16px] h-[2px] border border-solid border-black mt-[19.5px] ml-[12.5px]",
  numbered:
    "h-[40px] w-[40px] pt-[4px] border-2 border-solid border-gray-400 rounded-full",
  stepByStep: "h-[40px] w-[40px] pt-[6px] rounded-full bg-blue-800 text-white",
} satisfies Record<ListVariant, string>;

const ListIcon = ({
  index,
  variant,
}: {
  index?: number;
  variant: ListVariant;
}) => (
  <div className={iconClassnames[variant]}>
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
    <div id={identifier} className="flex flex-row gap-16 pb-32">
      <div className="text-center basis-[40px] shrink-0">
        <ListIcon index={index} variant={variant} />
      </div>
      <div className="ds-stack ds-stack-32">
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
