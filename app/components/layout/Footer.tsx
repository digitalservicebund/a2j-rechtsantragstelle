import Background from "~/components/layout/Background";
import { translations as staticTranslations } from "~/services/translations/translations";
import Heading from "../common/Heading";
import Image, { type ImageProps } from "../common/Image";
import RichText, { type RichTextProps } from "../common/RichText";
import { StandaloneLink } from "../common/StandaloneLink";
import Container from "../layout/Container";
import GridContainer from "../GridContainer";
import { GridItem } from "../GridItem";
import { ContentGrid } from "../ContentGrid";

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
    <>
      <ContentGrid className="py-40 print:pb-0">
        {/* Column 1: logo + text */}
        <GridItem span={12} lgSpan={3} className="flex flex-col gap-y-8">
          {image?.url && (
            <div className="forced-colors:bg-black">
              <Image
                {...image}
                width={120}
                className="forced-colors:brightness-0 forced-colors:invert"
              />
            </div>
          )}
          <div className="ds-stack ds-stack-8 max-w-[288px]">
            {paragraphs.map((p) => (
              <div key={p.html}>
                <RichText
                  className="ds-label-03-reg [&_a]:inline-block"
                  {...p}
                />
              </div>
            ))}
          </div>
        </GridItem>

        {categorizedLinks.map((category, i) => {
          const ariaLabelledBy = `footer-list-${dashifyLowercase(category.title)}`;
          return (
            <GridItem key={category.id} span={12} mdSpan={4} lgSpan={3}>
              <Heading
                tagName="h2"
                elementId={ariaLabelledBy}
                className="ds-label-03-bold"
              >
                {category.title}
              </Heading>
              <ul
                aria-labelledby={ariaLabelledBy}
                className="list-none pt-[7px] pl-2 space-y-10 print:hidden"
              >
                <Links links={category.links} />
              </ul>
            </GridItem>
          );
        })}
      </ContentGrid>

      {showDeletionBanner && (
        <ContentGrid className="pb-40">
          <GridItem
            span={8}
            mdSpan={8}
            mdStart={1}
            lgSpan={8}
            lgStart={3}
            xlSpan={8}
            xlStart={3}
            className="bg-blue-100 text-white print:hidden text-center pt-16 pb-16"
          >
            <StandaloneLink
              className="ds-label-03-reg"
              text="Persönliche Daten löschen"
              url="/persoenliche-daten-loeschen"
            />
          </GridItem>
        </ContentGrid>
      )}
    </>
  );
}
