import ArrowDownward from "@digitalservicebund/icons/ArrowDownward";
import { arrayIsNonEmpty } from "~/util/array";
import Button, { type ButtonProps } from "./Button";
import ButtonContainer from "./ButtonContainer";
import Heading, { type HeadingProps } from "./Heading";
import { StandaloneLink } from "./StandaloneLink";
import GridContainer from "./GridContainer";
import { GridItem } from "./GridContainer";

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
    <GridContainer
      columns={12}
      maxWidth="xl"
      alignItems="start"
      paddingX="sm"
      justifyContent="start"
    >
      <GridItem span={12} colStart={1}>
        <div className="ds-stack ds-stack-16" id={identifier}>
          <div className="ds-stack ds-stack-8">
            {label && <Heading {...label} />}
            {heading && <Heading {...heading} />}
            {links && links.length > 0 && (
              <ul className="list-none pl-0 ds-stack ds-stack-16">
                {links.map((link) => (
                  <li key={link.text ?? link.url}>
                    <StandaloneLink
                      className="visited:text-black !text-black flex"
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
    </GridContainer>
  );
};

export default TableOfContents;
