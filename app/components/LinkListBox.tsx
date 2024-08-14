import ArrowDownward from "@digitalservicebund/icons/ArrowDownward";
import { Link } from "@remix-run/react";
import { z } from "zod";
import { arrayIsNonEmpty } from "~/util/array";
import Button, { ButtonPropsSchema } from "./Button";
import ButtonContainer from "./ButtonContainer";
import Heading, { type HeadingProps } from "./Heading";

export const LinkListBoxPropsSchema = z.object({
  identifier: z.string().optional(),
  label: z.custom<HeadingProps>().optional(),
  heading: z.custom<HeadingProps>().optional(),
  links: z.array(
    z.object({
      text: z.string().optional(),
      url: z.string().optional(),
    }),
  ),
  buttons: z.array(ButtonPropsSchema).optional(),
});

type LinkListBoxProps = z.infer<typeof LinkListBoxPropsSchema>;

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
        {links && (
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
