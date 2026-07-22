import Heading from "~/components/common/Heading";
import CardGroup from "~/components/content/card/CardGroup";
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
    <GridSection>
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
          <Heading
            tagName="h2"
            text={translations.homepage.headingHilfreicheInformationen.de}
            managedByParent
            className="kern-heading-x-large p-0! outline-none pt-40! pb-40!"
          />

          <CardGroup cards={infoCards} />
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
  );
};
export default Homepage;
