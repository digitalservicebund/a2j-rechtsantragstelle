import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import Button, { ButtonPropsSchema } from "./Button";
import { Link } from "@remix-run/react";
import ButtonContainer from "./ButtonContainer";
import ArrowDownward from "@mui/icons-material/ArrowDownward";

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
                    <ArrowDownward className="h-[1em] w-[1em]" /> {link.text}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
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
