import { useLoaderData, useLocation } from "react-router";
import Label from "~/components/common/Label";
import ContentComponents from "~/components/content/ContentComponents";
import Hero from "~/components/content/Hero";
import TableOfContents from "~/components/content/TableOfContents";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { NavigationList } from "~/components/navigation/NavigationList";
import { type NavItem } from "~/components/navigation/types";
import { type loader } from "~/routes/shared/hubPages";
import { isStrapiHero } from "~/services/cms/models/content/isStrapiHero";
import { navigationLists, tableOfContents } from "~/services/routing/hubPages";
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
  const navItems = navigationLists[
    pathname as keyof typeof navigationLists
  ] as NavItem[];

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
              className="rounded-lg mb-kern-space-4x-large"
            />
          </GridItem>

          <GridItem
            mdColumn={{ start: 1, span: 6 }}
            lgColumn={{ start: 10, span: 3 }}
            xlColumn={{ start: 10, span: 3 }}
            row={3}
          >
            <aside aria-label={translations.hubPages.navigationLabel.de}>
              <nav aria-labelledby="navigation-label">
                <Label
                  tagName="h2"
                  text={translations.hubPages.navigationLabel.de}
                  className="kern-label kern-label--small"
                  elementId="navigation-label"
                />
                <NavigationList
                  className={"!bg-kern-darkblue-050"}
                  navItems={navItems}
                ></NavigationList>
              </nav>
            </aside>
          </GridItem>
        </Grid>
      </GridSection>
    </>
  );
}
