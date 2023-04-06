import { marked } from "marked";

type RichTextProps = {
  markdown: string;
};

const RichText = ({ markdown, ...props }: RichTextProps) => {
  const renderer = {
    link(href: string, title: string, text: string) {
      if (href.includes("ext:")) {
        const newHref = href.replace("ext:", "");
        return `<a href=${newHref} target="_blank" rel="noreferrer">${text}</a>`;
      }
      return `<a href=${href}>${text}</a>`;
    },
  };
  marked.use({ renderer });
  return (
    <div
      {...props}
      dangerouslySetInnerHTML={{ __html: marked.parse(markdown) }}
    />
  );
};

export default RichText;
