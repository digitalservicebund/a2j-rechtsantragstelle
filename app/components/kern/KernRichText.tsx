export type RichTextProps = {
  html: string;
  className?: string;
};

const KernRichText = ({ html, className }: RichTextProps) => {
  return (
    <div
      className={`kern-rich-text kern-stack-sm kern-body-text ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default KernRichText;