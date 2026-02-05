export type RichTextProps = {
  html: string;
  className?: string;
};

const KernRichText = ({ html, className }: RichTextProps) => {
  return (
    <div
      className={`kern-body gap-kern-space-default flex flex-col ${className ?? ""} rich-text`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default KernRichText;
