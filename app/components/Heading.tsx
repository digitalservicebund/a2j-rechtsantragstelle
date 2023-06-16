import classNames from "classnames";
import type { ReactNode } from "react";
import { z } from "zod";

export const HeadingPropsSchema = z.object({
  tagName: z.string().optional(), // TODO: This should be more narrow
  text: z.string().optional(),
  look: z.string().optional(),
  className: z.string().optional(),
  children: z.custom<ReactNode>().optional(),
});

export type HeadingProps = z.infer<typeof HeadingPropsSchema>;

function Heading({
  tagName = "h1",
  text,
  className,
  look,
  children,
}: HeadingProps) {
  const Tag = tagName as keyof React.JSX.IntrinsicElements;
  const cssClasses = classNames(look === "default" ? null : look, className);

  if (children) {
    return <Tag className={cssClasses}>{children}</Tag>;
  }

  return (
    <Tag
      className={cssClasses}
      dangerouslySetInnerHTML={{ __html: text ?? "" }}
    />
  );
}

export default Heading;
