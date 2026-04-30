import Image, { type ImageProps } from "~/components/common/Image";
import { arrayIsNonEmpty } from "~/util/array";
import KernRichText from "./KernRichText";
import KernButton, { type ButtonProps } from "./KernButton";
import { type KernHeadlineProps } from "./KernHeadline";
import KernLabel, { type KernLabelProps } from "./KernLabel";
import {
  KernInlineNotice,
  type KernInlineNoticeProps,
} from "./KernInlineNotice";
import KernAccordion, { type KernAccordionProps } from "./KernAccordion";
import KernHeading from "./KernHeading";
import { Details, type DetailsProps } from "../content/Details";
import KernButtonContainer from "./KernButtonContainer";

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
      <div className="flex flex-col gap-kern-space-small">
        {label && <KernLabel {...label} />}
        {headline && <KernHeading managedByParent {...headline} />}
        {content && <KernRichText html={content} />}
        {details?.map((details) => (
          <Details key={details.title} {...details} />
        ))}
        {inlineNotices?.map((inlineNotice) => (
          <KernInlineNotice key={inlineNotice.title} {...inlineNotice} nested />
        ))}
        {arrayIsNonEmpty(buttons) && (
          <KernButtonContainer>
            {buttons.map((button) => (
              <KernButton key={button.text ?? button.href} {...button} />
            ))}
          </KernButtonContainer>
        )}
        {accordion && <KernAccordion {...accordion} />}
      </div>
    </div>
  );
};

export default KernBoxItem;
