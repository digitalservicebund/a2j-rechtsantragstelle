import { useLoaderData, useLocation } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import Hero from "~/components/content/Hero";
import TableOfContents from "~/components/content/TableOfContents";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { type loader } from "~/routes/shared/hubPages";
import { isStrapiHero } from "~/services/cms/models/content/isStrapiHero";
import { tableOfContents } from "~/services/routing/hubPages";
import { translations } from "~/services/translations/translations";

export function HubPage() {
  const { content } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();

  const heroComponent = content?.find(isStrapiHero);
  const nonHeroComponent = content?.filter(
    (c) => !isStrapiHero(c) && c.__component !== "page.table-of-contents",
  );

  const tableOfContentLinks =
    tableOfContents[pathname as keyof typeof tableOfContents];

  return (
    <>
      <GridSection className="bg-kern-darkblue-050 pb-kern-space-x-large text-pretty hyphens-none break-normal">
        <Grid>
          {heroComponent && (
            <GridItem
              mdColumn={{ start: 1, span: 7 }}
              lgColumn={{ start: 1, span: 8 }}
              xlColumn={{ start: 1, span: 8 }}
            >
              <Hero {...heroComponent} />
            </GridItem>
          )}
        </Grid>
      </GridSection>

      <GridSection className="py-kern-space-6x-large text-pretty hyphens-none break-normal">
        <Grid>
          <GridItem
            mdColumn={{ start: 1, span: 7 }}
            lgColumn={{ start: 1, span: 3 }}
            xlColumn={{ start: 1, span: 3 }}
            row={1}
          >
            <TableOfContents
              label={{
                tagName: "h2",
                className: "kern-label kern-label--small",
                text: translations.hubPages.tableOfLinksLabel.de,
                managedByParent: true,
              }}
              links={tableOfContentLinks}
              classNameLinks="kern-link--small"
            />
          </GridItem>
          <GridItem
            mdColumn={{ start: 1, span: 7 }}
            lgColumn={{ start: 4, span: 6 }}
            xlColumn={{ start: 4, span: 6 }}
            row={2}
          >
            <ContentComponents
              managedByParent
              content={nonHeroComponent}
              className="rounded-lg mb-kern-space-6x-large"
            />
          </GridItem>

          <GridItem
            mdColumn={{ start: 1, span: 7 }}
            lgColumn={{ start: 10, span: 2 }}
            xlColumn={{ start: 10, span: 2 }}
            row={3}
          >
            <h3 className="text-xs font-bold text-slate-800">
              Weitere Inhalte zum Thema
            </h3>
            <nav className="bg-blue-50/60 rounded-md overflow-hidden text-xs text-slate-700">
              <ul className="divide-y divide-blue-100">
                <li>
                  <a
                    href="#"
                    className="block p-3 font-semibold text-blue-900 hover:bg-blue-100/50"
                  >
                    Beratungshilfe
                  </a>
                </li>
                <li>
                  <a href="#" className="block p-3 hover:bg-blue-100/50">
                    Übersicht
                  </a>
                </li>
                <li>
                  <a href="#" className="block p-3 hover:bg-blue-100/50">
                    Vorab-Check
                  </a>
                </li>
                <li>
                  <a href="#" className="block p-3 hover:bg-blue-100/50">
                    Antrag
                  </a>
                </li>
                <li>
                  <a href="#" className="block p-3 hover:bg-blue-100/50">
                    Benötigte Dokumente
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-3 font-semibold text-blue-900 hover:bg-blue-100/50"
                  >
                    Prozesskostenhilfe
                  </a>
                </li>
              </ul>
            </nav>
          </GridItem>
        </Grid>
      </GridSection>
    </>
  );
}
