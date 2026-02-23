import ButtonContainer from "~/components/common/ButtonContainer";
import Image, { type ImageProps } from "~/components/common/Image";
import { Details, type DetailsProps } from "~/components/content/Details";
import { arrayIsNonEmpty } from "~/util/array";
import KernRichText from "./KernRichText";
import KernButton, { type ButtonProps } from "./KernButton";
import KernHeadline, { type KernHeadlineProps } from "./KernHeadline";
import KernLabel, { type KernLabelProps } from "./KernLabel";
import {
  KernInlineNotice,
  type KernInlineNoticeProps,
} from "./KernInlineNotice";
import KernAccordion, { type KernAccordionProps } from "./KernAccordion";

export type KernBoxItemProps = {
  id: number; // Strapi id
  identifier?: string;
  label?: KernLabelProps;
  headline?: KernHeadlineProps;
  image?: ImageProps;
  content?: string;
  details?: DetailsProps[];
  inlineNotices?: KernInlineNoticeProps[];
  buttons?: ButtonProps[];
  separator?: boolean;
  accordion?: KernAccordionProps;
};

const KernBoxItem = ({
  identifier,
  label,
  headline,
  image,
  content,
  details,
  inlineNotices,
  buttons,
  accordion,
}: KernBoxItemProps) => {
  return (
    <div id={identifier}>
      {image && (
        <Image
          {...image}
          className="max-[499px]:mb-16 max-[499px]:w-[144px] max-[499px]:h-[144px] h-[168px] w-[168px] self-baseline"
        />
      )}
      <div className="flex flex-col gap-kern-space-x-large">
        {label && <KernLabel {...label} />}
        {headline && <KernHeadline {...headline} />}
        {content && <KernRichText html={content} />}
        {details?.map((details) => (
          <Details key={details.title} {...details} />
        ))}
        {inlineNotices?.map((inlineNotice) => (
          <KernInlineNotice key={inlineNotice.title} {...inlineNotice} nested />
        ))}
        {arrayIsNonEmpty(buttons) && (
          <ButtonContainer>
            {buttons.map((button) => (
              <KernButton key={button.text ?? button.href} {...button} />
            ))}
          </ButtonContainer>
        )}
        {accordion && <KernAccordion {...accordion} />}
      </div>
    </div>
  );
};

export default KernBoxItem;
