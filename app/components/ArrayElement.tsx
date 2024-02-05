import { z } from "zod";
import Button, { ButtonPropsSchema } from "./Button";
import Heading, { HeadingPropsSchema } from "./Heading";
import Image, { ImagePropsSchema } from "./Image";
import RichText from "./RichText";
import ButtonContainer from "./ButtonContainer";
import { Translations } from "~/services/cms/index.server";

export const ArrayElementPropsSchema = z.object({
  title: z.string(),
  key: z.string(),
});

type ArrayElementProps = z.infer<typeof ArrayElementPropsSchema>;

const ArrayElement = ({
  title,
  key,
}: ArrayElementProps & { readonly translations?: Translations }) => {
  return (
    <div
      id={identifier}
      className={"flex flex-row items-center justify-center"}
    >
      <div className={`break-words w-full ${image ? "min-[500px]:ml-16" : ""}`}>
        <div className="flex flex-row gap-16 items-center">
          {numeric ? (
            <div className="min-w-[40px] w-[40px] h-[40px] pt-[4px] text-center border-2 border-solid border-gray-400 rounded-full">
              {numeric}
            </div>
          ) : (
            <div className="w-[16px] min-h-[1px] border border-solid border-black mr-[5px] ml-[17px]" />
          )}
          {label && <Heading {...label} />}
          {headline && <Heading {...headline} />}
        </div>
        {content && <RichText markdown={content} className="ml-[56px]" />}
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

export default ArrayElement;
