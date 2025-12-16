import { translations as staticTranslations } from "~/services/translations/translations";
import KernRichText, { type RichTextProps } from "../KernRichText";
import Image, { type ImageProps } from "~/components/common/Image";
import { KernStandaloneLink } from "../KernStandaloneLink";
import { GridItem } from "~/components/layout/grid/GridItem";
import { Grid } from "~/components/layout/grid/Grid";
import { GridSection } from "~/components/layout/grid/GridSection";

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
      <li key={link.url} className="">
        <KernStandaloneLink
          text={link.text ?? ""}
          url={link.url}
          className="kern-body"
        />
      </li>
    );
  });
};

const dashifyLowercase = (text: string) =>
  text.toLowerCase().replaceAll(/\s+/g, "-");

export default function KernFooter({
  image,
  paragraphs = [],
  categorizedLinks,
  showDeletionBanner = false,
  ariaLabel,
}: FooterProps) {
  return (
    <>
      <Grid className="py-40 px-0 print:pb-0">
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 1, span: 3 }}
          xlColumn={{ start: 1, span: 3 }}
          className="flex flex-col gap-kern-space-large"
        >
          {image && (
            <div className="forced-colors:bg-black">
              <Image {...image} />
            </div>
          )}
          {paragraphs.map((paragraph) => (
            <KernRichText {...paragraph} key={paragraph.html} />
          ))}
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 4, span: 9 }}
          xlColumn={{ start: 4, span: 9 }}
          className="[grid-row:2] md:[grid-row:2] lg:[grid-row:1] xl:[grid-row:1]"
          aria-label={ariaLabel}
        >
          <nav
            className="flex flex-col sm:flex-row justify-between print:hidden"
            aria-label={ariaLabel}
          >
            {categorizedLinks.map((category) => {
              const ariaLabelledBy = `footer-list-${dashifyLowercase(category.title)}`;
              return (
                <div
                  key={category.id}
                  className="flex flex-col gap-kern-space-small py-kern-space-large"
                >
                  <h2 className="kern-body--bold">{category.title}</h2>
                  <ul
                    aria-labelledby={ariaLabelledBy}
                    className="list-none! flex flex-col gap-kern-space-small"
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
        <GridSection className="bg-kern-neutral-025">
          <Grid>
            <GridItem
              mdColumn={{ start: 1, span: 8 }}
              lgColumn={{ start: 3, span: 8 }}
              xlColumn={{ start: 2, span: 10 }}
              className="text-white print:hidden text-center pt-16 pb-16"
            >
              <div className="text-center print:hidden">
                <KernStandaloneLink
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
        </GridSection>
      )}
    </>
  );
}
