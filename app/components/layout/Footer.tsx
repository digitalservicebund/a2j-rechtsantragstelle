import Background from "~/components/layout/Background";
import { translations as staticTranslations } from "~/services/translations/translations";
import Heading from "../common/Heading";
import Image, { type ImageProps } from "../common/Image";
import RichText, { type RichTextProps } from "../common/RichText";
import { StandaloneLink } from "../common/StandaloneLink";
import Container from "../layout/Container";

type LinkProps = {
  url: string;
  text?: string;
};

type CategorizedLinkProps = {
  readonly id: number;
  readonly title: string;
  readonly links: LinkProps[];
};

type FooterProps = Readonly<{
  categorizedLinks: CategorizedLinkProps[];
  paragraphs?: RichTextProps[];
  image?: ImageProps;
  showDeletionBanner?: boolean;
  ariaLabel?: string;
}>;

const Links = ({ links }: Pick<CategorizedLinkProps, "links">) => {
  return links.map((link) => {
    return (
      <li key={link.url} className="leading-snug ds-label-03-reg">
        <StandaloneLink text={link.text ?? ""} url={link.url} />
      </li>
    );
  });
};

const dashifyLowercase = (text: string) =>
  text.toLowerCase().replace(/\s+/g, "-");

export default function Footer({
  image,
  paragraphs = [],
  categorizedLinks,
  showDeletionBanner = false,
  ariaLabel,
}: FooterProps) {
  return (
    <Container paddingTop="48" paddingBottom="56">
      <div
        className="flex flex-col md:flex-row gap-32 mb-32 pr-16 pl-16"
        data-testid="footer"
      >
        <div className="flex flex-col max-w-[288px] print:max-w-full gap-y-8">
          {image?.url && <Image {...image} width={120} />}
          <div className="ds-stack ds-stack-8">
            {paragraphs.map((paragraph) => (
              <div key={paragraph.html}>
                <RichText
                  {...paragraph}
                  className="ds-label-03-reg [&_a]:inline-block"
                />
              </div>
            ))}
          </div>
        </div>

        <nav
          className="flex flex-col sm:flex-row gap-16 print:hidden"
          aria-label={ariaLabel}
        >
          {categorizedLinks.map((category) => {
            const ariaLabelledBy = `footer-list-${dashifyLowercase(category.title)}`;
            return (
              <div key={category.id}>
                <Heading
                  tagName="h2"
                  elementId={ariaLabelledBy}
                  className="ds-label-03-bold"
                >
                  {category.title}
                </Heading>
                <ul
                  aria-labelledby={ariaLabelledBy}
                  className="list-none pt-[7px] pl-2 space-y-10"
                >
                  <Links links={category.links} />
                </ul>
              </div>
            );
          })}
        </nav>
      </div>
      {showDeletionBanner && (
        <Background
          backgroundColor="blue"
          paddingTop="16"
          paddingBottom="16"
          className="text-center print:hidden"
        >
          <StandaloneLink
            className="ds-label-03-reg"
            text={staticTranslations["delete-data"].footerLinkLabel.de}
            url="/persoenliche-daten-loeschen"
          />
        </Background>
      )}
    </Container>
  );
}
