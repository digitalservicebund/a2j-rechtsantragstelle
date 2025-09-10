import { translations as staticTranslations } from "~/services/translations/translations";
import Heading from "../common/Heading";
import Image, { type ImageProps } from "../common/Image";
import RichText, { type RichTextProps } from "../common/RichText";
import { StandaloneLink } from "../common/StandaloneLink";
import { Grid } from "./grid/Grid";
import { GridItem } from "./grid/GridItem";

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
      <Grid className="py-40 print:pb-0">
        <GridItem
          span={12}
          lgSpan={3}
          xlSpan={3}
          className="flex flex-col gap-y-8"
        >
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
        <GridItem span={12} lgSpan={9} xlSpan={9} aria-label={ariaLabel}>
          <nav
            className="flex flex-col sm:flex-row justify-between print:hidden"
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
        </GridItem>
      </Grid>

      {showDeletionBanner && (
        <Grid className="pb-40">
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
            <div className="text-center print:hidden">
              <StandaloneLink
                className="ds-label-03-reg"
                text={
                  staticTranslations["delete-data"].footerLinkLabel.de ??
                  "Persönliche Daten löschen"
                }
                url="/persoenliche-daten-loeschen"
              />
            </div>
          </GridItem>
        </Grid>
      )}
    </>
  );
}
