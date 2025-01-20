export type RichTextProps = {
  markdown: string;
};

const RichText = ({
  markdown,
  className = "",
  ...props
}: RichTextProps & {
  id?: string;
  className?: string;
}) => {
  if (!markdown) return null;

  return (
    <div
      {...props}
      className={`rich-text ds-stack-8 ${className}`}
      dangerouslySetInnerHTML={{ __html: markdown }}
    />
  );
};

export default RichText;
