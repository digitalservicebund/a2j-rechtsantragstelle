import { z } from "zod";
import { arrayIsNonEmpty } from "~/util/array";
import Button, { ButtonPropsSchema } from "./Button";
import ButtonContainer from "./ButtonContainer";
import Heading, { type HeadingProps } from "./Heading";
import RichText from "./RichText";

export const ListItemPropsSchema = z.object({
  identifier: z.string().optional(),
  label: z.custom<HeadingProps>().optional(),
  headline: z.custom<HeadingProps>().optional(),
  content: z.string().optional(),
  buttons: z.array(ButtonPropsSchema).optional(),
});

type ListItemProps = z.infer<typeof ListItemPropsSchema>;

const ListIcon = ({ numeric }: { numeric?: number }) =>
  numeric ? (
    <div className="h-[40px] w-[40px] pt-[4px] border-2 border-solid border-gray-400 rounded-full">
      {numeric}
    </div>
  ) : (
    <div className="w-[16px] h-[2px] border border-solid border-black mt-[19.5px] ml-[12.5px]" />
  );

const ListItem = ({
  identifier,
  label,
  headline,
  content,
  buttons,
  numeric,
}: ListItemProps & { readonly numeric?: number }) => {
  return (
    <div id={identifier} className="flex flex-row gap-16">
      <div className="text-center basis-[40px] shrink-0">
        <ListIcon numeric={numeric} />
      </div>
      <div className="basis-auto">
        <div className="flex flex-row gap-16">
          {label && <Heading {...label} />}
          {headline && <Heading {...headline} />}
        </div>
        {content && <RichText markdown={content} />}
        {arrayIsNonEmpty(buttons) && (
          <ButtonContainer className="mt-16">
            {buttons.map((button) => (
              <Button key={button.text ?? button.href} {...button} />
            ))}
          </ButtonContainer>
        )}
      </div>
    </div>
  );
};

export default ListItem;
