import { getTranslationByKey } from "~/services/translations/getTranslationByKey";
import { translations as staticTranslations } from "~/services/translations/translations";
import Background from "./Background";
import Container from "./Container";
import Heading from "./Heading";
import Image, { type ImageProps } from "./Image";
import RichText, { type RichTextProps } from "./RichText";
import { StandaloneLink } from "./StandaloneLink";
import { GridContainer, GridItem } from ".";

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
  translations?: Record<string, string>;
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
  translations,
}: FooterProps) {
  const ariaLabelTranslation = getTranslationByKey(
    "footer-navigation",
    translations,
  );
  return (
    <GridContainer columns={12} maxWidth="xl" paddingX="xl" paddingY="xl">
      <GridItem
        span={3}
        spanXs={3}
        spanSm={3}
        spanMd={3}
        spanLg={3}
        spanXl={3}
        spanXxl={3}
        colStartSm={1}
        colStartMd={1}
        colStartLg={1}
      >
        {/* <div
          className="flex flex-col md:flex-row gap-32 mb-32"
          data-testid="footer"
        > */}
        <div className="flex flex-col max-w-[288px] gap-y-8">
          {image?.url && (
            <div className="forced-colors:bg-black">
              <Image
                {...image}
                width={120}
                className="forced-colors:brightness-0 forced-colors:invert"
              />
            </div>
          )}
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
      </GridItem>
      {/* <GridItem
        span={9}
        spanXs={9}
        spanSm={9}
        spanMd={9}
        colStartSm={4}
        colStartMd={4}
        colStartLg={4}
        colStartXl={4}
      >
        <nav
          className="flex flex-col sm:flex-row justify-between w-full gap-16"
          aria-label={ariaLabelTranslation}
        > */}
      {categorizedLinks.map((category) => {
        const ariaLabelledBy = `footer-list-${dashifyLowercase(category.title)}`;
        return (
          <GridItem
            key={category.id}
            span={12}
            spanXs={12}
            spanSm={12}
            spanMd={3}
            spanLg={3}
            spanXl={3}
            spanXxl={3}
          >
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
          </GridItem>
        );
      })}
      {/* </nav> */}
      {/* </div> */}
      {/* </GridItem> */}
      <GridItem
        span={12}
        spanXs={12}
        spanSm={12}
        spanMd={6}
        spanLg={6}
        colStart={1}
        colStartXs={1}
        colStartSm={1}
        colStartMd={4}
        colStartLg={4}
        className="mb-[3rem]"
      >
        {showDeletionBanner && (
          <Background backgroundColor="blue" paddingTop="16" paddingBottom="16">
            <div className="text-center">
              <StandaloneLink
                className="ds-label-03-reg"
                text={
                  staticTranslations["delete-data"].footerLinkLabel.de ??
                  "Persönliche Daten löschen"
                }
                url="/persoenliche-daten-loeschen"
              />
            </div>
          </Background>
        )}
      </GridItem>
    </GridContainer>
  );
}
