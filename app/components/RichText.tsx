import { marked } from "marked";

type RichTextProps = {
  markdown: string;
};

const RichText = ({ markdown }: RichTextProps) => {
  return <div dangerouslySetInnerHTML={{ __html: marked.parse(markdown) }} />;
};

export default RichText;
