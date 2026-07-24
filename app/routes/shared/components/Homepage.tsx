import Heading from "~/components/common/Heading";
import { Icon } from "~/components/common/Icon";
import Box from "~/components/content/Box";
import CardGroup from "~/components/content/card/CardGroup";
import Hero from "~/components/content/Hero";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { translations } from "~/services/translations/translations";

const Homepage = () => {
  const serviceCards = [
    {
      id: translations.homepage.cardIdFGR.de,
      title: translations.homepage.cardTitleFGR.de,
      heading: translations.homepage.cardHeadingFGR.de,
      description: translations.homepage.cardDescriptionFGR.de,
      buttonLabel: translations.homepage.cardButtonLabelFGR.de,
      span: 4,
    },
    {
      id: translations.homepage.cardIdTGA.de,
      title: translations.homepage.cardTitleTGA.de,
      heading: translations.homepage.cardHeadingTGA.de,
      description: translations.homepage.cardDescriptionTGA.de,
      buttonLabel: translations.homepage.cardButtonLabelTGA.de,
      span: 4,
    },
    {
      id: translations.homepage.cardIdBerH.de,
      title: translations.homepage.cardTitleBerH.de,
      heading: translations.homepage.cardHeadingBerH.de,
      description: translations.homepage.cardDescriptionBerH.de,
      buttonLabel: translations.homepage.cardButtonLabelBerH.de,
      span: 4,
    },
    {
      id: translations.homepage.cardIdPKH.de,
      title: translations.homepage.cardTitlePKH.de,
      heading: translations.homepage.cardHeadingPKH.de,
      description: translations.homepage.cardDescriptionPKH.de,
      buttonLabel: translations.homepage.cardButtonLabelPKH.de,
      span: 4,
    },
    {
      id: translations.homepage.cardIdKontopfaendung.de,
      title: translations.homepage.cardTitleKontopfaendung.de,
      heading: translations.homepage.cardHeadingKontopfaendung.de,
      description: translations.homepage.cardDescriptionKontopfaendung.de,
      buttonLabel: translations.homepage.cardButtonLabelKontopfaendung.de,
      span: 4,
    },
    {
      id: translations.homepage.cardIdErbschein.de,
      title: translations.homepage.cardTitleErbschein.de,
      heading: translations.homepage.cardHeadingErbschein.de,
      description: translations.homepage.cardDescriptionErbschein.de,
      buttonLabel: translations.homepage.cardButtonLabelErbschein.de,
      span: 4,
    },
  ];

  const infoCards = [
    {
      id: translations.homepage.cardIdRechtsprobleme.de,
      heading: translations.homepage.cardHeadingRechtsprobleme.de,
      title: translations.homepage.cardTitleRechtsprobleme.de,
      description: translations.homepage.cardDescriptionRechtsprobleme.de,
      buttonLabel: translations.homepage.cardButtonLabelRechtsprobleme.de,
      span: 6,
    },
    {
      id: translations.homepage.cardIdAnleitung.de,
      heading: translations.homepage.cardHeadingAnleitung.de,
      title: translations.homepage.cardTitleAnleitung.de,
      description: translations.homepage.cardDescriptionAnleitung.de,
      buttonLabel: translations.homepage.cardButtonLabelAnleitung.de,
      span: 6,
    },
  ];

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
                text: translations.homepage.heroHeading.de,
                size: "xLarge",
                managedByParent: true,
              }}
              content={{
                html: translations.homepage.heroContent.de,
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
                text: translations.homepage.boxProjektPartnerHeading.de,
                managedByParent: true,
              }}
              content={translations.homepage.boxProjektPartnerContent.de}
              image={{
                url: "app/assets/BMJV_Logo.svg",
                alternativeText:
                  translations.homepage.boxProjektPartnerAltText.de,
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
              text={translations.homepage.headingOnlinedieste.de}
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
              text={translations.homepage.headingHilfreicheInformationen.de}
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
              text={translations.homepage.headingMitmachen.de}
              className="kern-heading-x-large p-0! outline-none pt-40! pb-40!"
              managedByParent
            />
            <CardGroup
              cards={[
                {
                  id: translations.homepage.cardIdStudie.de,
                  heading: translations.homepage.cardHeadingStudie.de,
                  title: translations.homepage.cardTitleStudie.de,
                  description: translations.homepage.cardDescriptionStudie.de,
                  buttonLabel: translations.homepage.cardButtonLabelStudie.de,
                  span: 6,
                },
              ]}
            />
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
                text: translations.homepage.boxZugangeZumRecht.de,
                managedByParent: true,
              }}
              content={
                <>
                  <p>{translations.homepage.boxZugangeZumRechtContent.de}</p>

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
                    {translations.homepage.boxZugangeZumRechtProjektLink.de}
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
                    {translations.homepage.boxZugangeZumRechtJustizLink.de}
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
