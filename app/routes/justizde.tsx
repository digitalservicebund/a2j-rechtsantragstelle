import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData } from "react-router";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { fetchJustizNavigation } from "~/services/cms/index.server";
import {
  justizDeHref,
  justizDeLocales,
  parseJustizDePath,
  type JustizDeLocale,
} from "~/services/routing/justizDe";

const siteTitle: Record<JustizDeLocale, string> = {
  de: "Justizportal des Bundes und der Länder",
  en: "Justice Portal of the Federation and the Länder",
};

const menuLabel: Record<JustizDeLocale, string> = {
  de: "Hauptmenü",
  en: "Main menu",
};

const languageMenuLabel: Record<JustizDeLocale, string> = {
  de: "Sprache",
  en: "Language",
};

const localeLabel: Record<JustizDeLocale, string> = {
  de: "Deutsch",
  en: "English",
};

const legalLabel: Record<JustizDeLocale, string> = {
  de: "Rechtliche Hinweise",
  en: "Legal notices",
};

const footerLinks: Record<JustizDeLocale, { url: string; label: string }[]> = {
  de: [
    { url: "/impressum", label: "Impressum" },
    { url: "/datenschutz", label: "Datenschutz" },
    { url: "/service/barrierefreiheit", label: "Barrierefreiheit" },
    { url: "/leichte_sprache", label: "Leichte Sprache" },
    { url: "/gebaerdensprache", label: "Gebärdensprache" },
  ],
  en: [
    { url: "/impressum", label: "Legal notice" },
    { url: "/datenschutz", label: "Privacy" },
  ],
};

export const loader = async ({ url }: LoaderFunctionArgs) => {
  const { locale, slug } = parseJustizDePath(url.pathname);
  return {
    locale,
    slug,
    navigation: await fetchJustizNavigation("draft", locale),
  };
};

const contentColumns = {
  mdColumn: { start: 1, span: 8 },
  lgColumn: { start: 2, span: 10 },
  xlColumn: { start: 2, span: 10 },
  className: "px-kern-space-large lg:px-0 xl:px-0",
} as const;

// Standalone shell for migrated justiz.de content, so it is visibly separate
// from the Justiz-Services layout rendered by root.tsx
export default function JustizDeLayout() {
  const { navigation, locale, slug } = useLoaderData<typeof loader>();

  return (
    <>
      <header className="border-b border-kern-layout-border">
        <GridSection>
          <Grid>
            <GridItem {...contentColumns}>
              <div className="flex flex-wrap items-baseline justify-between gap-kern-space-default py-kern-space-default">
                <a
                  href={justizDeHref(locale, "/")}
                  className="kern-link p-0! no-underline!"
                >
                  <span className="kern-heading-small">
                    {siteTitle[locale]}
                  </span>
                </a>
                <nav aria-label={languageMenuLabel[locale]}>
                  <ul className="flex gap-kern-space-default list-none ps-0">
                    {justizDeLocales.map((candidate) => (
                      <li key={candidate}>
                        {candidate === locale ? (
                          <span
                            className="kern-body kern-body--small kern-body--bold"
                            aria-current="true"
                          >
                            {localeLabel[candidate]}
                          </span>
                        ) : (
                          <a
                            href={justizDeHref(candidate, slug)}
                            className="kern-link kern-body--small p-0!"
                            hrefLang={candidate}
                          >
                            {localeLabel[candidate]}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              {navigation.length > 0 && (
                <nav aria-label={menuLabel[locale]}>
                  <ul className="flex flex-wrap gap-kern-space-large list-none ps-0 pb-kern-space-default">
                    {navigation.map((item) => (
                      <li key={item.slug}>
                        <a
                          href={justizDeHref(locale, item.slug)}
                          className="kern-link p-0!"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </GridItem>
          </Grid>
        </GridSection>
      </header>

      {/* root.tsx already provides the <main> landmark */}
      <div id="justizde-content">
        <Outlet />
      </div>

      <footer className="bg-kern-neutral-050 mt-kern-space-large">
        <GridSection>
          <Grid>
            <GridItem {...contentColumns}>
              <nav
                aria-label={legalLabel[locale]}
                className="py-kern-space-default"
              >
                <ul className="flex flex-wrap gap-kern-space-default list-none ps-0">
                  {footerLinks[locale].map(({ url, label }) => (
                    <li key={url}>
                      <a
                        href={justizDeHref(locale, url)}
                        className="kern-link kern-body--small p-0!"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </GridItem>
          </Grid>
        </GridSection>
      </footer>
    </>
  );
}
