import { marked } from "marked";

type RichTextProps = {
  markdown: string;
  renderer?: any;
};

const RichText = ({ markdown, renderer, ...props }: RichTextProps) => {
  // Reset marked to default options before use because of a bug in marked https://github.com/markedjs/marked/issues/907
  marked.setOptions(marked.getDefaults());
  marked.use({
    mangle: false,
    headerIds: false,
    renderer: renderer || {
      link(href: string, title: string, text: string) {
        if (href.includes("ext:")) {
          const newHref = href.replace("ext:", "");
          return `<a href=${newHref} target="_blank" rel="noreferrer">${text}</a>`;
        }
        return `<a href=${href}>${text}</a>`;
      },
      heading(text: string, level: number) {
        const cssClass =
          ["ds-heading-01-reg", "ds-heading-02-reg", "ds-heading-03-reg"][
            level - 1
          ] || "ds-heading-03-reg";
        return `<h${level} class="${cssClass}">${text}</h${level}>`;
      },
    },
  });
  return (
    <div
      {...props}
      className="rich-text ds-stack-8"
      dangerouslySetInnerHTML={{ __html: marked.parse(markdown) }}
    />
  );
};

export default RichText;
