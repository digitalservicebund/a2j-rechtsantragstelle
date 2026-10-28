import classNames from "classnames";
import { useLoaderData, useLocation } from "react-router";
import Label from "~/components/common/Label";
import ContentComponents, {
  getSectionBackgroundColor,
} from "~/components/content/ContentComponents";
import Hero from "~/components/content/Hero";
import TableOfContents from "~/components/content/TableOfContents";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { NavigationList } from "~/components/navigation/NavigationList";
import { type loader } from "~/routes/shared/hubPages";
import { isStrapiHero } from "~/services/cms/models/content/isStrapiHero";
import { navigationLists, tableOfContents } from "~/services/routing/hubPages";
import { translations } from "~/services/translations/translations";

export function HubPage() {
  const { content, showNewHubPage } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();

  // Disable the new hub page via feature flag
  if (!showNewHubPage) {
    return <ContentComponents content={content} />;
  }

  const heroComponent = content?.find(isStrapiHero);
  const nonHeroComponent = content?.filter(
    (c) => !isStrapiHero(c) && c.__component !== "page.table-of-contents",
  );

  const tableOfContentLinks =
    tableOfContents[pathname as keyof typeof tableOfContents];
  const navItems = navigationLists[pathname as keyof typeof navigationLists];

  return (
    <>
      {heroComponent && (
        <GridSection
          className={classNames(
            "pb-kern-space-x-large md:text-pretty md:hyphens-none md:break-normal",
            getSectionBackgroundColor(heroComponent),
          )}
        >
          <Grid>
            <GridItem
              mdColumn={{ start: 1, span: 7 }}
              lgColumn={{ start: 1, span: 8 }}
              xlColumn={{ start: 1, span: 8 }}
            >
              <Hero {...heroComponent} />
            </GridItem>
          </Grid>
        </GridSection>
      )}

      <GridSection className="py-kern-space-6x-large md:text-pretty md:hyphens-none md:break-normal">
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
              isHubPage
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
            <div aria-label={translations.hubPages.navigationLabel.de}>
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
            </div>
          </GridItem>
        </Grid>
      </GridSection>
    </>
  );
}
