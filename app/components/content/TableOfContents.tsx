import ArrowDownward from "@digitalservicebund/icons/ArrowDownward";
import { arrayIsNonEmpty } from "~/util/array";
import Button, { type ButtonProps } from "../common/Button";
import ButtonContainer from "../common/ButtonContainer";
import Heading, { type HeadingProps } from "../common/Heading";
import { StandaloneLink } from "../common/StandaloneLink";
import { ContentGrid } from "../ContentGrid";
import { BACKGROUND_COLORS } from "..";
import { Section } from "../Section";
import { GridItem } from "../GridItem";

type Props = {
  identifier?: string;
  label?: HeadingProps;
  heading?: HeadingProps;
  links?: Array<{ text?: string; url: string }>;
  buttons?: ButtonProps[];
};

const TableOfContents = ({
  identifier,
  label,
  heading,
  links,
  buttons,
}: Props) => {
  return (
    <ContentGrid className="pb-64">
      <GridItem
        span={12}
        mdSpan={7}
        mdStart={1}
        lgStart={3}
        lgSpan={7}
        xlStart={3}
        xlSpan={7}
      >
        <div className="ds-stack ds-stack-16" id={identifier}>
          <div className="ds-stack ds-stack-8">
            {label && <Heading {...label} />}
            {heading && <Heading {...heading} />}
            {links && links.length > 0 && (
              <ul className="list-none pl-0 ds-stack ds-stack-16">
                {links.map((link) => (
                  <li key={link.text ?? link.url}>
                    <StandaloneLink
                      className="visited:text-black text-black! flex"
                      url={link.url}
                      text={link.text ?? ""}
                      icon={
                        <ArrowDownward className="h-[1em] w-[1em] shrink-0 my-[0.25em]" />
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
          {arrayIsNonEmpty(buttons) && (
            <ButtonContainer>
              {buttons.map((button) => (
                <Button key={button.text ?? button.href} {...button} />
              ))}
            </ButtonContainer>
          )}
        </div>
      </GridItem>
    </ContentGrid>
  );
};

export default TableOfContents;
