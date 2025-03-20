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

type CategorizedLinkProps = {
  id: number;
  title: string;
  links: LinkProps[];
};

export type FooterProps = Readonly<{
  links?: LinkProps[];
  categorizedLinks?: CategorizedLinkProps[];
  paragraphs?: RichTextProps[];
  image?: ImageProps;
  deletionLabel?: string;
  showDeletionBanner?: boolean;
  translations?: Record<string, string>;
}>;

const Links = ({ links }: Pick<CategorizedLinkProps, "links">) => {
  return links.map((link) => {
    return (
      <li key={link.url} className="leading-snug ds-label-03-reg">
        <StandaloneLink
          text={link.text ?? ""}
          url={link.url}
          className="pb-6" // adding extra space to avoid bug in safari
        />
      </li>
    );
  });
};

export default function Footer({
  image,
  paragraphs = [],
  links = [],
  categorizedLinks,
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
        className="flex flex-col md:flex-row gap-32 mb-32 pr-16 pl-16"
        data-testid="footer"
      >
        <div className="flex flex-col min-w-[288px] gap-y-8">
          {image?.url && (
            <div className="forced-colors:bg-black">
              <Image
                {...image}
                width={120}
                className="forced-colors:brightness-0 forced-colors:invert"
              />
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
          className="flex flex-col sm:flex-row gap-16"
          aria-label={ariaLabelTranslation}
        >
          {categorizedLinks?.map((category) => (
            <div key={category.id}>
              <p className="ds-label-03-bold mb-7">{category.title}</p>
              <ul className="list-none pl-2 space-y-10">
                <Links links={category.links} />
              </ul>
            </div>
          ))}
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
