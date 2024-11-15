import Background from "./Background";
import Container from "./Container";
import Image, { type ImageProps } from "./Image";
import RichText, { type RichTextProps } from "./RichText";
import { StandaloneLink } from "./StandaloneLink";

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

export default function Footer({
  image,
  paragraphs = [],
  links = [],
  deletionLabel,
  showDeletionBanner = false,
}: FooterProps) {
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
          <ul className="list-none m-0 p-0 space-y-8 columns-2">
            {links.map((link) => (
              <li key={link.url} className="leading-snug">
                <StandaloneLink
                  text={link.text ?? ""}
                  url={link.url}
                  className="pb-6" // adding extra space to avoid bug in safari
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {showDeletionBanner && (
        <Background backgroundColor="blue" paddingTop="16" paddingBottom="16">
          <div className="ds-label-03-reg text-center">
            <StandaloneLink
              text={deletionLabel ?? "Persönliche Daten löschen"}
              url="/persoenliche-daten-loeschen"
            />
          </div>
        </Background>
      )}
    </Container>
  );
}
