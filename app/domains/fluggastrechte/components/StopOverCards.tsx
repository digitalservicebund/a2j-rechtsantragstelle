import SummaryDataOverviewCard from "./SummaryDataOverviewCard";
import type { FluggastrechtContext } from "../formular/context";
import { getAirportByIataCode } from "../services/airports/getAirportByIataCode";
import {
  getAnzahlZwischenstopps,
  getZwischenStops,
  type ZwischenstoppsProps,
} from "../services/summaryPage/stoppOver";

const getBetroffenerFlug = (userData: FluggastrechtContext) => {
  const startAirportName = getAirportByIataCode(userData.startAirport)?.airport;
  const endAirportName = getAirportByIataCode(userData.endAirport)?.airport;
  const ersterZwischenStoppName = getAirportByIataCode(
    userData.ersterZwischenstopp,
  )?.airport;
  const zweiterZwischenStoppName = getAirportByIataCode(
    userData.zweiterZwischenstopp,
  )?.airport;
  const dritterZwischenStoppName = getAirportByIataCode(
    userData.dritterZwischenstopp,
  )?.airport;

  if (userData.verspaeteterFlug === "startAirportFirstZwischenstopp")
    return `${startAirportName} - ${ersterZwischenStoppName}`;
  if (userData.verspaeteterFlug === "firstZwischenstoppEndAirport")
    return `${ersterZwischenStoppName} - ${endAirportName}`;
  if (userData.verspaeteterFlug === "firstAirportSecondZwischenstopp")
    return `${ersterZwischenStoppName} - ${zweiterZwischenStoppName}`;
  if (userData.verspaeteterFlug === "secondZwischenstoppEndAirport")
    return `${zweiterZwischenStoppName} - ${endAirportName}`;
  if (userData.verspaeteterFlug === "secondAirportThirdZwischenstopp")
    return `${zweiterZwischenStoppName} - ${dritterZwischenStoppName}`;
  if (userData.verspaeteterFlug === "thirdZwischenstoppEndAirport")
    return `${dritterZwischenStoppName} - ${endAirportName}`;
};

function StopOverCards({
  userData,
  translations,
}: Readonly<ZwischenstoppsProps>) {
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
          showValueHeading={false}
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
