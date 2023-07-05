import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import Button, { ButtonPropsSchema } from "./Button";
import { Link } from "@remix-run/react";

export const LinkListBoxPropsSchema = z.object({
  identifier: z.string().optional().nullable(),
  label: HeadingPropsSchema.optional().nullable(),
  heading: HeadingPropsSchema.optional().nullable(),
  links: z
    .array(
      z
        .object({
          text: z.string().nullable(),
          url: z.string().nullable(),
        })
        .nullable()
    )
    .optional()
    .nullable(),
  button: ButtonPropsSchema.optional().nullable(),
});

export type LinkListBoxProps = z.infer<typeof LinkListBoxPropsSchema>;

const LinkListBox = ({
  identifier,
  label,
  heading,
  links,
  button,
}: LinkListBoxProps) => {
  return (
    <div className="ds-stack-16" id={identifier ?? undefined}>
      <div className="ds-stack-8">
        {label && <Heading {...label} />}
        {heading && <Heading {...heading} />}
        {links && (
          <div className="flex flex-col">
            {links.map((link) => (
              <Link
                className="underline"
                key={link?.text ?? ""}
                to={link?.url ?? ""}
              >
                {link?.text}
              </Link>
            ))}
          </div>
        )}
      </div>
      {button && (
        <div>
          <Button {...button} />
        </div>
      )}
    </div>
  );
};

export default LinkListBox;
