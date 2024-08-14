import classNames from "classnames";
import { z } from "zod";
import { arrayIsNonEmpty } from "~/util/array";
import Button, { ButtonPropsSchema } from "./Button";
import ButtonContainer from "./ButtonContainer";
import { DetailsSummary, DetailsSummarySchema } from "./DetailsSummary";
import Heading, { type HeadingProps } from "./Heading";
import Image, { ImagePropsSchema } from "./Image";
import RichText from "./RichText";

export const InfoBoxItemPropsSchema = z.object({
  identifier: z.string().optional(),
  label: z.custom<HeadingProps>().optional(),
  headline: z.custom<HeadingProps>().optional(),
  image: ImagePropsSchema.optional(),
  content: z.string().optional(),
  detailsSummary: DetailsSummarySchema.optional().or(
    z.array(DetailsSummarySchema).optional(),
  ),
  buttons: z.array(ButtonPropsSchema).optional(),
  separator: z.boolean().optional(),
});

type InfoBoxItemProps = z.infer<typeof InfoBoxItemPropsSchema>;

const InfoBoxItem = ({
  identifier,
  label,
  headline,
  image,
  content,
  detailsSummary,
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
        {detailsSummary && !Array.isArray(detailsSummary) && (
          <DetailsSummary {...detailsSummary} />
        )}
        {Array.isArray(detailsSummary) &&
          detailsSummary.map((details) => (
            <DetailsSummary key={details.title} {...details} />
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
