import classNames from "classnames";
import type { ReactNode } from "react";
import { z } from "zod";

export const HeadingPropsSchema = z
  .object({
    tagName: z
      .enum(["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"])
      .optional(),
    text: z.string().optional(),
    look: z.string().optional(),
    className: z.string().optional(),
    children: z.custom<ReactNode>().optional(),
    dataTestid: z.string().optional(),
  })
  .readonly();

type HeadingProps = z.infer<typeof HeadingPropsSchema>;

function Heading({
  tagName = "h1",
  text,
  className,
  look,
  children,
  dataTestid,
}: HeadingProps) {
  const Tag = tagName as keyof React.JSX.IntrinsicElements;
  const cssClasses = classNames(look === "default" ? null : look, className);

  if (children) {
    return (
      <Tag data-testid={dataTestid} className={cssClasses}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      data-testid={dataTestid}
      className={cssClasses}
      dangerouslySetInnerHTML={{
        __html: text ?? "",
      }}
    />
  );
}

export default Heading;
