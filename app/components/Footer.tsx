import { getTranslationByKey } from "~/services/translations/getTranslationByKey";
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
  translations?: Record<string, string>;
}>;

export default function Footer({
  image,
  paragraphs = [],
  links = [],
  deletionLabel,
  showDeletionBanner = false,
  translations,
}: FooterProps) {
  const ariaLabelTranslation = getTranslationByKey(
    "footer-navigation",
    translations,
  );
  return (
    <Container paddingTop="48" paddingBottom="56">
      <div
        className="flex flex-wrap items-start justify-between gap-y-32 mb-32"
        data-testid="footer"
      >
        <div className="flex flex-col flex-col-reverse sm:flex-row gap-y-8 gap-x-16">
          {image?.url && (
            <div>
              <Image {...image} width={120} />
            </div>
          )}
          <div className="ds-stack-8">
            {paragraphs.map((paragraph) => (
              <div key={paragraph.html}>
                <RichText {...paragraph} className="ds-label-03-reg" />
              </div>
            ))}
          </div>
        </div>

        <nav
          className="flex flex-wrap gap-x-32 gap-y-8"
          aria-label={ariaLabelTranslation}
        >
          <ul className="list-none m-0 p-0 space-y-8 columns-2">
            {links.map((link) => (
              <li key={link.url} className="leading-snug ds-label-03-reg">
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
          <div className="text-center">
            <StandaloneLink
              className="ds-label-03-reg"
              text={deletionLabel ?? "Persönliche Daten löschen"}
              url="/persoenliche-daten-loeschen"
            />
          </div>
        </Background>
      )}
    </Container>
  );
}
