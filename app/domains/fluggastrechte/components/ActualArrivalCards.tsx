import type { Context } from "~/domains/contexts";
import type { Translations } from "~/services/translations/getTranslationByKey";
import SummaryDataOverviewCard from "./SummaryDataOverviewCard";

function ActualArrivalCards({
  userData,
  translations,
}: {
  readonly userData: Context;
  readonly translations: Translations;
}) {
  if (userData.tatsaechlicherFlug === "yes") {
    return (
      <SummaryDataOverviewCard
        title="Tatsächliche Ankunft"
        subtitle="(Mit dem ursprünglich geplanten Flug)"
        buttonUrl="/fluggastrechte/formular/flugdaten/tatsaechlicher-flug-ankunft"
        data={{
          Ankunft: `${userData.tatsaechlicherAnkunftsDatum} - ${userData.tatsaechlicherAnkunftsZeit}`,
        }}
        translations={translations}
      />
    );
  }
  if (userData.tatsaechlicherFlug === "no") {
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
            ankunft: `${userData.tatsaechlicherAnkunftsDatum} \n ${userData.tatsaechlicherAnkunftsZeit}`,
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
}

export default ActualArrivalCards;
