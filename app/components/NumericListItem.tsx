import { z } from "zod";
import Button, { ButtonPropsSchema } from "./Button";
import Heading, { HeadingPropsSchema } from "./Heading";
import Image, { ImagePropsSchema } from "./Image";
import RichText from "./RichText";
import ButtonContainer from "./ButtonContainer";

export const NumericListItemPropsSchema = z.object({
  identifier: z.string().optional(),
  label: HeadingPropsSchema.optional(),
  headline: HeadingPropsSchema.optional(),
  image: ImagePropsSchema.optional(),
  content: z.string().optional(),
  buttons: z.array(ButtonPropsSchema).optional(),
});

type NumericListItemProps = z.infer<typeof NumericListItemPropsSchema>;

const NumericListItem = ({
  identifier,
  label,
  headline,
  image,
  content,
  buttons,
}: NumericListItemProps) => {
  return (
    <div
      key={identifier}
      className={"flex flex-row items-center justify-center"}
    >
      {image && (
        <Image
          {...image}
          {...{
            className:
              "max-[499px]:mb-16 max-[499px]:w-[144px] max-[499px]:h-[144px] h-[168px] w-[168px]" +
              " self-baseline",
          }}
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
        {buttons && buttons.length > 0 && (
          <ButtonContainer>
            {buttons.map((button) => (
              <Button key={button.text ?? button.href} {...button} />
            ))}
          </ButtonContainer>
        )}
      </div>
    </div>
  );
};

export default NumericListItem;
