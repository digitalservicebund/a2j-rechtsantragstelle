import classNames from "classnames";
import { decode } from "html-entities";
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

export type HeadingProps = z.infer<typeof HeadingPropsSchema>;

function Heading({
  tagName = "h1",
  text,
  className,
  look,
  children,
  dataTestid,
}: HeadingProps) {
  const Tag: keyof JSX.IntrinsicElements = tagName;
  const cssClasses = classNames(look === "default" ? null : look, className);

  if ((typeof text === "undefined" || text?.trim() === "") && !children) {
    return null;
  }

  return (
    <Tag data-testid={dataTestid} className={cssClasses}>
      {children ?? decode(text)}
    </Tag>
  );
}

export default Heading;
