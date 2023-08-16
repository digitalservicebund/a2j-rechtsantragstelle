import { z } from "zod";
import type { Renderer } from "marked";
import Container from "./Container";
import Image, { ImagePropsSchema } from "./Image";
import { ParagraphPropsSchema } from "./Paragraph";
import RichText from "./RichText";

const LinkPropsSchema = z.object({
  url: z.string(),
  text: z.string(),
  openInNewTab: z.boolean().optional(),
});

type LinkProps = z.infer<typeof LinkPropsSchema>;

export const FooterPropsSchema = z.object({
  image: ImagePropsSchema.optional(),
  paragraphs: z.array(ParagraphPropsSchema),
  links: z.array(LinkPropsSchema),
});

type FooterProps = z.infer<typeof FooterPropsSchema>;

export default function Footer({
  image,
  paragraphs = [],
  links = [],
}: FooterProps) {
  const linksMiddleIndex = Math.ceil(links.length / 2);
  const linksFirstColumn: typeof links = links.slice(0, linksMiddleIndex);
  const linksSecondColumn: typeof links = links.slice(linksMiddleIndex);

  const renderLink = (link: LinkProps) => (
    <li key={link.url} className="leading-snug">
      <a
        href={link.url}
        className="text-link increase-tap-area"
        target={link.openInNewTab ? "_blank" : undefined}
        rel={link.openInNewTab ? "noopener" : undefined}
      >
        {link.text}
      </a>
    </li>
  );

  const renderLinks = (links: LinkProps[]) => (
    <ul className="list-none m-0 p-0 ds-stack-24" key={links[0]?.url}>
      {links.map(renderLink)}
    </ul>
  );

  const paragraphRenderer: Partial<Renderer> = {
    link(href, _, text) {
      return `<a class="text-link increase-tap-area whitespace-nowrap" href=${href} target="_blank" rel="noopener">${text}</a>`;
    },
    paragraph(text) {
      return `<p class="leading-snug">${text}</p>`;
    },
  };

  return (
    <footer className="text-base">
      <Container paddingTop="48">
        <div className="flex flex-wrap items-start justify-between gap-x-32 gap-y-40">
          <div className="flex flex-col-reverse gap-y-[1.125rem] sm:flex-col">
            {image?.url && (
              <div>
                <Image
                  url={image.url}
                  width={120}
                  alternativeText={image.alternativeText}
                />
              </div>
            )}
            <div className="ds-stack-32">
              {paragraphs.map((paragraph) => (
                <div key={paragraph.text}>
                  <RichText
                    markdown={paragraph.text}
                    renderer={paragraphRenderer}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-56 gap-y-24">
            {renderLinks(linksFirstColumn)}
            {renderLinks(linksSecondColumn)}
          </div>
        </div>
      </Container>
    </footer>
  );
}
