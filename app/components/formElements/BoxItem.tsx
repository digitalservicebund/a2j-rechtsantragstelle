import Image, { type ImageProps } from "~/components/common/Image";
import { arrayIsNonEmpty } from "~/util/array";
import RichText from "./RichText";
import Button, { type ButtonProps } from "./Button";
import { type HeadlineProps } from "./Headline";
import Label, { type LabelProps } from "./Label";
import { InlineNotice, type InlineNoticeProps } from "./InlineNotice";
import Accordion, { type AccordionProps } from "./Accordion";
import Heading from "./Heading";
import { Details, type DetailsProps } from "../content/Details";
import ButtonContainer from "./ButtonContainer";

export type BoxItemProps = {
  id: number; // Strapi id
  identifier?: string;
  label?: LabelProps;
  headline?: HeadlineProps;
  image?: ImageProps;
  content?: string;
  details?: DetailsProps[];
  inlineNotices?: InlineNoticeProps[];
  buttons?: ButtonProps[];
  separator?: boolean;
  accordion?: AccordionProps;
};

const BoxItem = ({
  identifier,
  label,
  headline,
  image,
  content,
  details,
  inlineNotices,
  buttons,
  accordion,
}: BoxItemProps) => {
  return (
    <div id={identifier}>
      {image && (
        <Image
          {...image}
          className="max-[499px]:mb-16 max-[499px]:w-[144px] max-[499px]:h-[144px] h-[168px] w-[168px] self-baseline"
        />
      )}
      <div className="flex flex-col gap-kern-space-small">
        {label && <Label {...label} />}
        {headline && <Heading managedByParent {...headline} />}
        {content && <RichText html={content} />}
        {details?.map((details) => (
          <Details key={details.title} {...details} />
        ))}
        {inlineNotices?.map((inlineNotice) => (
          <InlineNotice key={inlineNotice.title} {...inlineNotice} nested />
        ))}
        {arrayIsNonEmpty(buttons) && (
          <ButtonContainer>
            {buttons.map((button) => (
              <Button key={button.text ?? button.href} {...button} />
            ))}
          </ButtonContainer>
        )}
        {accordion && <Accordion {...accordion} />}
      </div>
    </div>
  );
};

export default BoxItem;
