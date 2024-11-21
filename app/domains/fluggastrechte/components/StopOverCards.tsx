import SummaryDataOverviewCard from "./SummaryDataOverviewCard";
import {
  getAnzahlZwischenstopps,
  getZwischenStops,
  type ZwischenstoppsProps,
} from "../services/summaryPage/stoppOver";

function StopOverCards({ userData, translations }: ZwischenstoppsProps) {
  if (!userData) return null;
  return (
    <>
      <SummaryDataOverviewCard
        title="Zwischenstops"
        data={getZwischenStops(userData)}
        buttonUrl={`/fluggastrechte/formular/flugdaten/zwischenstopp-uebersicht-${getAnzahlZwischenstopps(userData)}`}
        translations={translations}
      />
      {userData.verspaeteterFlug && (
        <SummaryDataOverviewCard
          title="Betroffener Flug"
          showVariableName={false}
          data={{ verspaeteterFlug: userData.verspaeteterFlug }}
          buttonUrl={`/fluggastrechte/formular/flugdaten/verspaeteter-flug-${getAnzahlZwischenstopps(userData)}`}
          translations={translations}
        />
      )}
      {userData.anschlussFlugVerpasst && (
        <SummaryDataOverviewCard
          title="Verpasste Anschlussflüge"
          data={{ anschlussFlugVerpasst: userData.anschlussFlugVerpasst }}
          buttonUrl="/fluggastrechte/formular/flugdaten/anschluss-flug-verpasst"
          translations={translations}
        />
      )}
    </>
  );
}

export default StopOverCards;
