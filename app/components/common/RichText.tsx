export type RichTextProps = {
  html: string;
  className?: string;
};

const RichText = ({ html, className }: RichTextProps) => {
  return (
    <div
      className={`kern-body flex flex-col rich-text ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichText;
