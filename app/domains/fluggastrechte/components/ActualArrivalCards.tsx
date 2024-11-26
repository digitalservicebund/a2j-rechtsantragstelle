import { FluggastrechtContext } from "../formular/context";
import type { Translations } from "~/services/translations/getTranslationByKey";
import SummaryDataOverviewCard from "./SummaryDataOverviewCard";

function ActualArrivalCards({
  userData,
  translations,
}: {
  readonly userData: FluggastrechtContext;
  readonly translations: Translations;
}) {
  if (userData.tatsaechlicherFlug === "yes") {
    return (
      <SummaryDataOverviewCard
        title="Tatsächliche Ankunft"
        subtitle="(Mit dem ursprünglich geplanten Flug)"
        buttonUrl="/fluggastrechte/formular/flugdaten/tatsaechlicher-flug-ankunft"
        data={{
          Ankunft: `${userData.tatsaechlicherAnkunftsDatum} \n ${userData.tatsaechlicherAnkunftsZeit}`,
        }}
        translations={translations}
      />
    );
  }
  if (userData.ersatzverbindungArt === "flug") {
    return (
      <SummaryDataOverviewCard
        title="Tatsächliche Ankunft"
        subtitle="(Mit einem anderen Flug)"
        data={{
          flugnummer: userData.ersatzFlugnummer,
          ankunft: `${userData.ersatzFlugAnkunftsDatum} \n ${userData.ersatzFlugAnkunftsZeit}`,
        }}
        buttonUrl="/fluggastrechte/formular/flugdaten/anderer-flug-ankunft"
        translations={translations}
      />
    );
  }
  if (userData.ersatzverbindungArt === "etwasAnderes") {
    return (
      <SummaryDataOverviewCard
        title="Tatsächliche Ankunft"
        subtitle="(Mit Bahn, Bus oder anderen Verkehrsmitteln)"
        data={{
          andereErsatzverbindungBeschreibung:
            userData.andereErsatzverbindungBeschreibung,
          ankunft: `${userData.andereErsatzverbindungAnkunftsDatum} \n ${userData.andereErsatzverbindungAnkunftsZeit}`,
        }}
        buttonUrl="/fluggastrechte/formular/flugdaten/ersatzverbindung-beschreibung"
        translations={translations}
      />
    );
  }
  if (userData.ersatzverbindungArt === "keineAnkunft") {
    return (
      <SummaryDataOverviewCard
        title="Tatsächliche Ankunft"
        showValueHeading={false}
        data={{
          keineAnkunft: "gar nicht angekommen",
        }}
        buttonUrl="/fluggastrechte/formular/flugdaten/ersatzverbindung-art"
        translations={translations}
      />
    );
  }
}

export default ActualArrivalCards;
