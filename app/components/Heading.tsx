import classNames from "classnames";
import type { ReactNode } from "react";
import { z } from "zod";
import { fillTemplate } from "~/util/fillTemplate";

export const HeadingPropsSchema = z.object({
  tagName: z.enum(["h1", "h2", "h3", "h4", "h5", "h6", "p", "div"]).optional(),
  text: z.string().optional(),
  look: z.string().optional(),
  className: z.string().optional(),
  children: z.custom<ReactNode>().optional(),
  templateReplacements: z.record(z.string(), z.string()).optional(),
});

export type HeadingProps = z.infer<typeof HeadingPropsSchema>;

function Heading({
  tagName = "h1",
  text,
  className,
  look,
  children,
  templateReplacements,
}: HeadingProps) {
  const Tag = tagName as keyof React.JSX.IntrinsicElements;
  const cssClasses = classNames(look === "default" ? null : look, className);

  if (children) {
    return <Tag className={cssClasses}>{children}</Tag>;
  }

  return (
    <Tag
      className={cssClasses}
      dangerouslySetInnerHTML={{
        __html: text
          ? fillTemplate({
              template: text,
              replacements: templateReplacements,
            })
          : "",
      }}
    />
  );
}

export default Heading;
