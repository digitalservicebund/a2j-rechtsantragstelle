export type RichTextProps = {
  html: string;
  className?: string;
};

const KernRichText = ({ html, className }: RichTextProps) => {
  console.log(html);
  return (
    <div
      className="kern-body gap-kern-space-default flex flex-col"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default KernRichText;
