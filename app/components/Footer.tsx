import { z } from "zod";
import type { Renderer } from "marked";
import Container from "./Container";
import Image, { ImagePropsSchema } from "./Image";
import RichText, { RichTextPropsSchema } from "./RichText";

const LinkPropsSchema = z.object({
  url: z.string(),
  text: z.string(),
  openInNewTab: z.boolean().optional(),
});

type LinkProps = z.infer<typeof LinkPropsSchema>;

export const FooterPropsSchema = z
  .object({
    image: ImagePropsSchema.optional(),
    paragraphs: z.array(RichTextPropsSchema),
    links: z.array(LinkPropsSchema),
  })
  .readonly();

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
    <ul className="list-none m-0 p-0 ds-stack-8" key={links[0]?.url}>
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
    <footer className="text-base" data-testid="footer">
      <Container paddingTop="48">
        <div className="flex flex-wrap items-start justify-between gap-y-32">
          <div className="flex flex-col flex-col-reverse sm:flex-row gap-y-8 gap-x-16">
            {image?.url && (
              <div>
                <Image
                  url={image.url}
                  width={120}
                  alternativeText={image.alternativeText}
                />
              </div>
            )}
            <div className="ds-stack-8">
              {paragraphs.map((paragraph) => (
                <div key={paragraph.markdown}>
                  <RichText {...paragraph} renderer={paragraphRenderer} />
                </div>
              ))}
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-32 gap-y-8" aria-label="Footer">
            {renderLinks(linksFirstColumn)}
            {renderLinks(linksSecondColumn)}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
