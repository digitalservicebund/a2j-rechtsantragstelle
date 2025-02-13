export type RichTextProps = {
  html: string;
  className?: string;
  text?: string;
};

const RichText = ({ html, className }: RichTextProps) => {
  return (
    <div
      className={`rich-text ds-stack-8 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichText;
