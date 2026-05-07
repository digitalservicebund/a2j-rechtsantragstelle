export type RichTextProps = {
  html: string;
  className?: string;
};

const RichText = ({ html, className }: RichTextProps) => {
  return (
    <div
      className={`kern-body  flex flex-col ${className ?? ""} rich-text`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichText;
