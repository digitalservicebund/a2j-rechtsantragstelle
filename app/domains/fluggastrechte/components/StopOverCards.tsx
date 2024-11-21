import SummaryDataOverviewCard from "./SummaryDataOverviewCard";
import {
  getAnzahlZwischenstopps,
  getZwischenStops,
  type ZwischenstoppsProps,
} from "../services/summaryPage/stoppOver";
import { FluggastrechtContext } from "../formular/context";

const getBetroffenerFlug = (userData: FluggastrechtContext) => {
  if (userData.verspaeteterFlug === "startAirportFirstZwischenstopp")
    return `${userData.startAirport} - ${userData.ersterZwischenstopp}`;
  if (userData.verspaeteterFlug === "firstZwischenstoppEndAirport")
    return `${userData.ersterZwischenstopp} - ${userData.endAirport}`;
  if (userData.verspaeteterFlug === "firstAirportSecondZwischenstopp")
    return `${userData.ersterZwischenstopp} - ${userData.zweiterZwischenstopp}`;
  if (userData.verspaeteterFlug === "secondZwischenstoppEndAirport")
    return `${userData.zweiterZwischenstopp} - ${userData.endAirport}`;
  if (userData.verspaeteterFlug === "secondAirportThirdZwischenstopp")
    return `${userData.zweiterZwischenstopp} - ${userData.dritterZwischenstopp}`;
  if (userData.verspaeteterFlug === "thirdZwischenstoppEndAirport")
    return `${userData.dritterZwischenstopp} - ${userData.endAirport}`;
};

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
          data={{ verspaeteterFlug: getBetroffenerFlug(userData) }}
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
