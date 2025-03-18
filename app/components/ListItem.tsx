import Accordion, { AccordionProps } from "~/components/Accordion";
import { arrayIsNonEmpty } from "~/util/array";
import Button, { type ButtonProps } from "./Button";
import ButtonContainer from "./ButtonContainer";
import Heading, { type HeadingProps } from "./Heading";
import RichText from "./RichText";

export type ListItemProps = {
  identifier?: string;
  headline?: HeadingProps;
  content?: string;
  buttons?: ButtonProps[];
  index?: number;
  accordion?: AccordionProps;
};

const ListIcon = ({ index }: { index?: number }) =>
  index ? (
    <div className="h-[40px] w-[40px] pt-[4px] border-2 border-solid border-gray-400 rounded-full">
      {index}
    </div>
  ) : (
    <div className="w-[16px] h-[2px] border border-solid border-black mt-[19.5px] ml-[12.5px]" />
  );

const ListItem = ({
  identifier,
  headline,
  content,
  buttons,
  index,
  accordion,
}: ListItemProps) => {
  return (
    <div id={identifier}>
      <div className="flex flex-row gap-16">
        <div className="text-center basis-[40px] shrink-0">
          <ListIcon index={index} />
        </div>
        <div className="basis-auto ds-stack-8">
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
      </div>
      {accordion && (
        <div role="region" className="w-full ml-56 mt-16">
          <Accordion {...accordion} />
        </div>
      )}
    </div>
  );
};

export default ListItem;
