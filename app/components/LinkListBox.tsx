import ArrowDownward from "@digitalservicebund/icons/ArrowDownward";
import { Link } from "@remix-run/react";
import { arrayIsNonEmpty } from "~/util/array";
import Button, { type ButtonProps } from "./Button";
import ButtonContainer from "./ButtonContainer";
import Heading, { type HeadingProps } from "./Heading";

export type LinkListBoxProps = {
  identifier?: string;
  label?: HeadingProps;
  heading?: HeadingProps;
  links?: Array<{ text?: string; url?: string }>;
  buttons?: ButtonProps[];
};

const LinkListBox = ({
  identifier,
  label,
  heading,
  links,
  buttons,
}: LinkListBoxProps) => {
  return (
    <div className="ds-stack-16" id={identifier}>
      <div className="ds-stack-8">
        {label && <Heading {...label} />}
        {heading && <Heading {...heading} />}
        {links && links.length > 0 && (
          <ul className="list-none pl-0 ds-stack-16">
            {links.map((link) => (
              <li key={link.text ?? link.url}>
                <Link
                  className="text-link visited:text-black !text-black"
                  to={link.url ?? ""}
                >
                  <span>
                    <ArrowDownward className="h-[1em] w-[1em] inline-block" />{" "}
                    {link.text}
                  </span>
                </Link>
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
  );
};

export default LinkListBox;
