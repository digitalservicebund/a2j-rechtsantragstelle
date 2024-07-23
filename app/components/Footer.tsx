import { isExternalUrl } from "~/util/url";
import Background from "./Background";
import Container from "./Container";
import Image, { type ImageProps } from "./Image";
import RichText, { type RichTextProps } from "./RichText";

type LinkProps = {
  url: string;
  text?: string;
};

export type FooterProps = Readonly<{
  links?: LinkProps[];
  paragraphs?: RichTextProps[];
  image?: ImageProps;
  deletionLabel?: string;
  showDeletionBanner?: boolean;
}>;

const renderLink = (link: LinkProps) => {
  const opts = isExternalUrl(link.url)
    ? { target: "_blank", rel: "noreferer" }
    : {};

  return (
    <li key={link.url} className="leading-snug">
      <a href={link.url} className="text-link" {...opts}>
        {link.text}
      </a>
    </li>
  );
};
const renderLinks = (links: LinkProps[]) => (
  <ul className="list-none m-0 p-0 ds-stack-8" key={links[0]?.url}>
    {links.map(renderLink)}
  </ul>
);

export default function Footer({
  image,
  paragraphs = [],
  links = [],
  deletionLabel,
  showDeletionBanner = false,
}: FooterProps) {
  const linksMiddleIndex = Math.ceil(links.length / 2);
  const linksFirstColumn: typeof links = links.slice(0, linksMiddleIndex);
  const linksSecondColumn: typeof links = links.slice(linksMiddleIndex);

  return (
    <Container paddingTop="48" paddingBottom="0">
      <div
        className="ds-label-03-reg flex flex-wrap items-start justify-between gap-y-32 mb-32"
        data-testid="footer"
      >
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
                <RichText {...paragraph} />
              </div>
            ))}
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-32 gap-y-8" aria-label="Footer">
          {renderLinks(linksFirstColumn)}
          {renderLinks(linksSecondColumn)}
        </nav>
      </div>
      {showDeletionBanner && (
        <Background backgroundColor="blue" paddingTop="16" paddingBottom="16">
          <div className="ds-label-03-reg text-center">
            <a className="text-link" href="/persoenliche-daten-loeschen">
              {deletionLabel ?? "Persönliche Daten löschen"}
            </a>
          </div>
        </Background>
      )}
    </Container>
  );
}
