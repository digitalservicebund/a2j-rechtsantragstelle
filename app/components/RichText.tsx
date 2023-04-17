import { marked } from "marked";

type RichTextProps = {
  markdown: string;
  renderer?: any;
};

const RichText = ({ markdown, renderer, ...props }: RichTextProps) => {
  // Reset marked to default options before use because of a bug in marked https://github.com/markedjs/marked/issues/907
  marked.setOptions(marked.getDefaults());
  marked.use({
    renderer: renderer || {
      link(href: string, title: string, text: string) {
        if (href.includes("ext:")) {
          const newHref = href.replace("ext:", "");
          return `<a href=${newHref} target="_blank" rel="noreferrer">${text}</a>`;
        }
        return `<a href=${href}>${text}</a>`;
      },
    },
  });
  return (
    <div
      {...props}
      className="rich-text ds-stack stack-16"
      dangerouslySetInnerHTML={{ __html: marked.parse(markdown) }}
    />
  );
};

export default RichText;
