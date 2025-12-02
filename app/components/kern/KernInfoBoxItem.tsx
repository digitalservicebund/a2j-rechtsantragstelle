import classNames from "classnames";
import Accordion, { type AccordionProps } from "~/components/common/Accordion";
import Button, { type ButtonProps } from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import Heading, { type HeadingProps } from "~/components/common/Heading";
import Image, { type ImageProps } from "~/components/common/Image";
import RichText from "~/components/common/RichText";
import { Details, type DetailsProps } from "~/components/content/Details";
import {
  InlineNotice,
  type InlineNoticeProps,
} from "~/components/content/InlineNotice";
import { arrayIsNonEmpty } from "~/util/array";
import KernRichText from "./KernRichText";
import KernHeading from "./KernHeading";
import KernButton from "./KernButton";
import KernHeadline from "./KernHeadline";
import KernLabel from "./KernLabel";

export type KernInfoBoxItemProps = {
  id: number; // Strapi id
  identifier?: string;
  label?: HeadingProps;
  headline?: HeadingProps;
  image?: ImageProps;
  content?: string;
  details?: DetailsProps[];
  inlineNotices?: InlineNoticeProps[];
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
  console.log(content);
  return (
    <div
      id={identifier}
      className={classNames("flex flex-row items-start justify-start")}
    >
      {image && (
        <Image
          {...image}
          className="max-[499px]:mb-16 max-[499px]:w-[144px] max-[499px]:h-[144px] h-[168px] w-[168px] self-baseline"
        />
      )}
      <div className="flex flex-col">
        {label && <KernLabel text={label.text} tagName={label.tagName} />}
        {headline && (
          <KernHeadline text={headline.text} tagName={headline.tagName} />
        )}
        {content && <KernRichText html={content} />}
        {details?.map((details) => (
          <Details key={details.title} {...details} />
        ))}
        {inlineNotices?.map((inlineNotice) => (
          <InlineNotice key={inlineNotice.title} {...inlineNotice} nested />
        ))}
        {arrayIsNonEmpty(buttons) && (
          <ButtonContainer>
            {buttons.map((button) => (
              <KernButton key={button.text ?? button.href} {...button} />
            ))}
          </ButtonContainer>
        )}
        {accordion && (
          <div className="max-w-[630px]">
            <Accordion {...accordion} />
          </div>
        )}
      </div>
    </div>
  );
};

export default KernInfoBoxItem;
