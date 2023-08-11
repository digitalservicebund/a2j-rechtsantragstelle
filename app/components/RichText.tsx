import { type Renderer, marked } from "marked";

type RichTextProps = {
  markdown: string;
  renderer?: Partial<Renderer>;
  className?: string;
};

const defaultRenderer: Partial<Renderer> = {
  link(href: string, title: string, text: string) {
    const cssClass = "text-link";
    if (href.includes("ext:")) {
      const newHref = href.replace("ext:", "");
      return `<a href="${newHref}" class="${cssClass}" target="_blank" rel="noreferrer">${text}</a>`;
    }
    return `<a href="${href}" class="${cssClass}">${text}</a>`;
  },
  heading(text: string, level: number) {
    const cssClass = [
      "ds-heading-01-reg",
      "ds-heading-02-reg",
      "ds-label-01-bold",
      "ds-label-01-bold",
      "ds-label-01-bold",
      "ds-label-01-bold",
    ][level - 1];
    return `<h${level} class="${cssClass}">${text}</h${level}>`;
  },
  paragraph(text: string) {
    return `<p class="text-lg">${text}</p>`;
  },
} as const;

const RichText = ({
  markdown,
  renderer,
  className,
  ...props
}: RichTextProps) => {
  // TODO: Can now be fixed since Marked 5.1.0, see https://github.com/markedjs/marked/pull/2831
  // Reset marked to default options before use because of a bug in marked https://github.com/markedjs/marked/issues/907
  marked.setOptions(marked.getDefaults());
  marked.use({ renderer: renderer ?? defaultRenderer });
  return (
    <div
      {...props}
      className={`rich-text ds-stack-8 ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: marked.parse(markdown) }}
    />
  );
};

export default RichText;
