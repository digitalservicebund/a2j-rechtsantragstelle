/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { Translations } from "~/services/translations/getTranslationByKey";
import SummaryDataOverviewCard from "./SummaryDataOverviewCard";
import type { FluggastrechtContext } from "../formular/context";
import {
  FLOW_ID,
  NO_SPECIFICATION,
} from "../services/summaryPage/getOverviewData";

const DATE_NO_SPECIFICATION = "Datum keine Angabe";
const TIME_NO_SPECIFICATION = "Zeit keine Angabe";

const getAnnullierungData = (userData: FluggastrechtContext) => {
  return {
    annullierungErsatzverbindungFlugnummer:
      userData.annullierungErsatzverbindungFlugnummer || NO_SPECIFICATION,
    annullierungErsatzverbindungAbflugsDatum: `${userData.annullierungErsatzverbindungAbflugsDatum || DATE_NO_SPECIFICATION} \n ${userData.annullierungErsatzverbindungAbflugsZeit || TIME_NO_SPECIFICATION}`,
    annullierungErsatzverbindungAnkunftsDatum: `${userData.annullierungErsatzverbindungAnkunftsDatum || DATE_NO_SPECIFICATION} \n ${userData.annullierungErsatzverbindungAnkunftsZeit || TIME_NO_SPECIFICATION}`,
  };
};

function ActualArrivalCards({
  userData,
  translations,
}: {
  readonly userData: FluggastrechtContext;
  readonly translations: Translations;
}) {
  if (userData.bereich === "annullierung") {
    if (userData.ersatzflug === "yes") {
      return (
        <SummaryDataOverviewCard
          title="Angebotene Ersatzverbindung"
          buttonUrl={`${FLOW_ID}/flugdaten/ersatzverbindung-daten`}
          data={getAnnullierungData(userData)}
          translations={translations}
        />
      );
    }
    return <></>;
  }

  if (userData.tatsaechlicherFlug === "yes") {
    return (
      <SummaryDataOverviewCard
        title="Tatsächliche Ankunft"
        subtitle="(Mit dem ursprünglich geplanten Flug)"
        buttonUrl={`${FLOW_ID}/flugdaten/tatsaechlicher-flug-ankunft`}
        data={{
          ankunft: `${userData.tatsaechlicherAnkunftsDatum} \n ${userData.tatsaechlicherAnkunftsZeit}`,
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
        buttonUrl={`${FLOW_ID}/flugdaten/anderer-flug-ankunft`}
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
        buttonUrl={`${FLOW_ID}/flugdaten/ersatzverbindung-beschreibung`}
        translations={translations}
      />
    );
  }
  return (
    <SummaryDataOverviewCard
      title="Tatsächliche Ankunft"
      showValueHeading={false}
      data={{
        keineAnkunft: "gar nicht angekommen",
      }}
      buttonUrl={`${FLOW_ID}/flugdaten/ersatzverbindung-art`}
      translations={translations}
    />
  );
}

export default ActualArrivalCards;
