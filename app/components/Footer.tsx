import { z } from "zod";
import type { Renderer } from "marked";
import Container from "./Container";
import Image, { ImagePropsSchema } from "./Image";
import { ParagraphPropsSchema } from "./Paragraph";
import RichText from "./RichText";
import { ResetCookieLink } from "~/services/analytics/Analytics";

const LinkPropsSchema = z.object({
  url: z.string(),
  text: z.string(),
});

type LinkProps = z.infer<typeof LinkPropsSchema>;

export const FooterPropsSchema = z.object({
  image: ImagePropsSchema.optional(),
  paragraphs: z.array(ParagraphPropsSchema),
  links: z.array(LinkPropsSchema),
});

export type FooterProps = z.infer<typeof FooterPropsSchema>;

export default function Footer({
  image,
  paragraphs = [],
  links = [],
}: FooterProps) {
  const linksMiddleIndex = Math.ceil(links.length / 2);
  const linksFirstColumn: typeof links = links.slice(0, linksMiddleIndex);
  const linksSecondColumn: typeof links = links.slice(linksMiddleIndex);

  const renderLink = (link: LinkProps) => (
    <li key={link.url}>
      <a
        href={link.url}
        className="ds-link-02-bold text-black focus-visible:outline"
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
      return `<a class="ds-link-02-bold text-black underline whitespace-nowrap focus-visible:outline" href=${href} target="_blank" rel="noreferrer">${text}</a>`;
    },
    paragraph(text) {
      return `<p class="ds-label-03-reg">${text}</p>`;
    },
  };

  return (
    <footer className="pt-48 pb-56">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-x-32 gap-y-40">
          <div className="flex flex-wrap flex-col-reverse gap-x-16 gap-y-8 sm:flex-row">
            {image?.url && (
              <div>
                <Image url={image.url} width={120} />
              </div>
            )}
            <div className="ds-stack-8">
              {paragraphs.map((paragraph) => (
                <RichText
                  markdown={paragraph.text}
                  renderer={paragraphRenderer}
                  key={paragraph.text}
                />
              ))}
              <div className="ds-label-03-reg">
                <ResetCookieLink />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-32 gap-y-8">
            {renderLinks(linksFirstColumn)}
            {renderLinks(linksSecondColumn)}
          </div>
        </div>
      </Container>
    </footer>
  );
}
