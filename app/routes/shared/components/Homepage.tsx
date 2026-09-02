import Heading from "~/components/common/Heading";
import CardGroup from "~/components/content/card/CardGroup";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Icon } from "~/components/common/Icon";
import Box from "~/components/content/Box";
import Hero from "~/components/content/Hero";
import BMJVLogo from "~/assets/BMJV_Logo.svg?raw";
import { infoCards, serviceCards, feedbackCard } from "./homepageContent";
import { pagesTranslations } from "~/services/translations/pages";

const Homepage = () => {
  return (
    <>
      <GridSection className="bg-kern-action-default" pt="40" pb="40">
        <Grid>
          <GridItem
            mdColumn={{ start: 1, span: 7 }}
            lgColumn={{ start: 1, span: 8 }}
            xlColumn={{ start: 1, span: 8 }}
          >
            <Hero
              heading={{
                tagName: "h1",
                text: pagesTranslations.homepage.heroHeading.de,
                size: "xLarge",
                managedByParent: true,
              }}
              content={{
                html: pagesTranslations.homepage.heroContent.de,
              }}
              sectionBackgroundColor="blue"
            />
          </GridItem>
        </Grid>
      </GridSection>
      <GridSection pt="40" pb="0">
        <Grid>
          <GridItem
            smColumn={{ start: 1, span: 10 }}
            mdColumn={{ start: 1, span: 10 }}
            lgColumn={{ start: 1, span: 10 }}
            xlColumn={{ start: 1, span: 10 }}
          >
            <Box
              heading={{
                tagName: "h2",
                size: "medium",
                text: pagesTranslations.homepage.boxProjektPartnerHeading.de,
                managedByParent: true,
              }}
              content={pagesTranslations.homepage.boxProjektPartnerContent.de}
              image={{
                svgString: BMJVLogo,
                url: "",
                alternativeText:
                  pagesTranslations.homepage.boxProjektPartnerAltText.de,
                width: 180,
                className: "mt-8",
              }}
            />
          </GridItem>
        </Grid>
      </GridSection>
      <GridSection pt="0" pb="80">
        <Grid>
          <GridItem
            smColumn={{ start: 1, span: 12 }}
            mdColumn={{ start: 1, span: 12 }}
            lgColumn={{ start: 1, span: 12 }}
            xlColumn={{ start: 1, span: 12 }}
          >
            <Heading
              tagName="h2"
              text={pagesTranslations.homepage.headingOnlinedieste.de}
              className="kern-heading-x-large p-0! outline-none pt-40! pb-40!"
              managedByParent
            />
            <CardGroup cards={serviceCards} />
          </GridItem>
        </Grid>
      </GridSection>
      <GridSection pt="0" pb="80">
        <Grid>
          <GridItem
            smColumn={{ start: 1, span: 12 }}
            mdColumn={{ start: 1, span: 12 }}
            lgColumn={{ start: 1, span: 12 }}
            xlColumn={{ start: 1, span: 12 }}
          >
            <Heading
              tagName="h2"
              text={
                pagesTranslations.homepage.headingHilfreicheInformationen.de
              }
              managedByParent
              className="kern-heading-x-large p-0! outline-none pt-40! pb-40!"
            />
            <CardGroup cards={infoCards} />
          </GridItem>
        </Grid>
      </GridSection>
      <GridSection pt="0" pb="80">
        <Grid>
          <GridItem
            smColumn={{ start: 1, span: 12 }}
            mdColumn={{ start: 1, span: 12 }}
            lgColumn={{ start: 1, span: 12 }}
            xlColumn={{ start: 1, span: 12 }}
          >
            <Heading
              tagName="h2"
              text={pagesTranslations.homepage.headingMitmachen.de}
              className="kern-heading-x-large p-0! outline-none pt-40! pb-40!"
              managedByParent
            />
            <CardGroup cards={feedbackCard} />
          </GridItem>
        </Grid>
      </GridSection>
      <GridSection className="bg-kern-layout-background-hued">
        <Grid>
          <GridItem
            smColumn={{ start: 1, span: 8 }}
            mdColumn={{ start: 1, span: 8 }}
            lgColumn={{ start: 1, span: 8 }}
            xlColumn={{ start: 1, span: 8 }}
          >
            <Box
              heading={{
                tagName: "h2",
                text: pagesTranslations.homepage.boxZugangeZumRecht.de,
                managedByParent: true,
              }}
              content={
                <>
                  <p>
                    {pagesTranslations.homepage.boxZugangeZumRechtContent.de}
                  </p>

                  <a
                    href="https://www.zugang-zum-recht-projekte.de/"
                    className="kern-link inline-block p-0! no-underline! hover:underline! wrap-anywhere"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="zugang-zum-recht-projekte.de, öffnet in neuem Tab"
                  >
                    <Icon
                      name="open-in-new"
                      className="size-[1em] inline! mt-3"
                    />
                    {
                      pagesTranslations.homepage.boxZugangeZumRechtProjektLink
                        .de
                    }
                  </a>
                  <a
                    href="https://www.justiz.de"
                    className="kern-link inline-block p-0! no-underline! hover:underline! wrap-anywhere"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="justiz.de, öffnet in neuem Tab"
                  >
                    <Icon
                      name="open-in-new"
                      className="size-[1em] inline! mt-3"
                    />
                    {pagesTranslations.homepage.boxZugangeZumRechtJustizLink.de}
                  </a>
                </>
              }
            />
          </GridItem>
        </Grid>
      </GridSection>
    </>
  );
};
export default Homepage;
