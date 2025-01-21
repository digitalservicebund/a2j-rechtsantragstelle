import { Renderer } from "marked";

export type RichTextProps = {
  markdown: string;
};

const RichText = ({
  markdown,
  renderer,
  className = "",
  ...props
}: RichTextProps & {
  renderer?: Partial<Renderer>;
  id?: string;
  className?: string;
}) => {
  return (
    <div
      {...props}
      className={`rich-text ds-stack-8 ${className}`}
      dangerouslySetInnerHTML={{ __html: markdown }}
    />
  );
};

export default RichText;
