import type { Renderer } from "marked";
import Container from "./Container";
import type { ImageProps } from "./Image";
import Image from "./Image";
import type { ParagraphProps } from "./Paragraph";
import RichText from "./RichText";

type LinkAttrs = {
  url: string;
  text: string;
};

export interface FooterProps {
  image: ImageProps;
  paragraphs: ParagraphProps[];
  links: LinkAttrs[];
}

export default function Footer({
  image,
  paragraphs = [],
  links = [],
}: FooterProps) {
  const linksMiddleIndex = Math.ceil(links.length / 2);
  const linksFirstColumn: typeof links = links.slice(0, linksMiddleIndex);
  const linksSecondColumn: typeof links = links.slice(linksMiddleIndex);

  const renderLink = (link: LinkAttrs) => (
    <li key={link.url}>
      <a href={link.url} className="ds-link-02-bold text-black">
        {link.text}
      </a>
    </li>
  );

  const renderLinks = (links: LinkAttrs[]) => (
    <ul className="list-none m-0 p-0 ds-stack stack-8" key={links[0]?.url}>
      {links.map(renderLink)}
    </ul>
  );

  const paragraphRenderer: Partial<Renderer> = {
    link(href, _, text) {
      return `<a class="ds-link-02-bold text-black whitespace-nowrap" href=${href} target="_blank" rel="noreferrer">${text}</a>`;
    },
    paragraph(text) {
      return `<p class="ds-label-03-reg">${text}</p>`;
    },
  };

  return (
    <Container>
      <footer className="pt-48 pb-56 flex flex-wrap items-start justify-between gap-x-32 gap-y-40">
        <div className="flex flex-wrap flex-col-reverse gap-x-16 gap-y-8 sm:flex-row">
          <Image {...{ ...image, style: { width: "120px" } }} />
          <div className="ds-stack stack-8">
            {paragraphs.map((paragraph) => (
              <RichText
                markdown={paragraph.text}
                renderer={paragraphRenderer}
                key={paragraph.text}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-32 gap-y-8">
          {renderLinks(linksFirstColumn)}
          {renderLinks(linksSecondColumn)}
        </div>
      </footer>
    </Container>
  );
}
