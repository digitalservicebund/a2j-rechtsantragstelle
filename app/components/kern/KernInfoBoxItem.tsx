import classNames from "classnames";
import Accordion, { type AccordionProps } from "~/components/common/Accordion";
import ButtonContainer from "~/components/common/ButtonContainer";
import Image, { type ImageProps } from "~/components/common/Image";
import { Details, type DetailsProps } from "~/components/content/Details";
import { arrayIsNonEmpty } from "~/util/array";
import KernRichText from "./KernRichText";
import KernButton, { type ButtonProps } from "./KernButton";
import KernHeadline, { type KernHeadlineProps } from "./KernHeadline";
import KernLabel, { type KernLabelProps } from "./KernLabel";
import { KernInlineNotice } from "./KernInlineNotice";
import KernAccordion from "./KernAccordion";

export type KernInlineNoticeProps = {
  identifier?: string;
  title: string;
  tagName: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
  look: "warning" | "tips" | "success" | "error";
  content?: string;
  wrap?: boolean;
  nested?: boolean;
};

export type KernInfoBoxItemProps = {
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
  accordion?: AccordionProps;
};

const KernInfoBoxItem = ({
  identifier,
  label,
  headline,
  image,
  content,
  details,
  inlineNotices,
  buttons,
  accordion,
}: KernInfoBoxItemProps) => {
  return (
    <div id={identifier} className="flex flex-row gap-kern-space-large">
      {image && (
        <Image
          {...image}
          className="max-[499px]:mb-16 max-[499px]:w-[144px] max-[499px]:h-[144px] h-[168px] w-[168px] self-baseline"
        />
      )}
      <div className="flex flex-col gap-kern-space-default">
        {label && <KernLabel {...label} />}
        {headline && <KernHeadline {...headline} />}
        {content && <KernRichText html={content} className="pt-32!" />}
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

export default KernInfoBoxItem;
