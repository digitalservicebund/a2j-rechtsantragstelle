import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import Button, { ButtonPropsSchema } from "./Button";
import { Link } from "@remix-run/react";
import ButtonContainer from "./ButtonContainer";

export const LinkListBoxPropsSchema = z.object({
  identifier: z.string().optional(),
  label: HeadingPropsSchema.optional(),
  heading: HeadingPropsSchema.optional(),
  links: z.array(
    z.object({
      text: z.string().optional(),
      url: z.string().optional(),
    }),
  ),
  button: ButtonPropsSchema.optional(),
  buttons: z.array(ButtonPropsSchema).optional(),
});

export type LinkListBoxProps = z.infer<typeof LinkListBoxPropsSchema>;

const LinkListBox = ({
  identifier,
  label,
  heading,
  links,
  button,
  buttons,
}: LinkListBoxProps) => {
  return (
    <div className="ds-stack-16" id={identifier ?? undefined}>
      <div className="ds-stack-8">
        {label && <Heading {...label} />}
        {heading && <Heading {...heading} />}
        {links && (
          <ul className="list-none pl-0">
            {links.map((link) => (
              <li key={link?.text ?? ""} className="my-8">
                <Link
                  className="text-link visited:text-black !text-black"
                  to={link?.url ?? ""}
                >
                  ↓ {link?.text}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      {button && (
        <div>
          <Button {...button} />
        </div>
      )}
      {buttons && buttons.length > 0 && (
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
