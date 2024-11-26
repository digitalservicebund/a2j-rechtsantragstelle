import SummaryDataOverviewCard from "./SummaryDataOverviewCard";
import type { FluggastrechtContext } from "../formular/context";
import { getAirportNameByIataCode } from "../services/airports/getAirportNameByIataCode";
import { FLOW_ID } from "../services/summaryPage/getOverviewData";
import {
  getAnzahlZwischenstopps,
  getZwischenStopps,
  type ZwischenstoppsProps,
} from "../services/summaryPage/stoppOver";

const getBetroffenerFlug = (userData: FluggastrechtContext) => {
  const startAirportName = getAirportNameByIataCode(userData.startAirport);
  const endAirportName = getAirportNameByIataCode(userData.endAirport);
  const ersterZwischenstoppName = getAirportNameByIataCode(
    userData.ersterZwischenstopp ?? "",
  );
  const zweiterZwischenstoppName = getAirportNameByIataCode(
    userData.zweiterZwischenstopp ?? "",
  );
  const dritterZwischenstoppName = getAirportNameByIataCode(
    userData.dritterZwischenstopp ?? "",
  );

  if (userData.verspaeteterFlug === "startAirportFirstZwischenstopp")
    return `${startAirportName} - ${ersterZwischenstoppName}`;
  if (userData.verspaeteterFlug === "firstZwischenstoppEndAirport")
    return `${ersterZwischenstoppName} - ${endAirportName}`;
  if (userData.verspaeteterFlug === "firstAirportSecondZwischenstopp")
    return `${ersterZwischenstoppName} - ${zweiterZwischenstoppName}`;
  if (userData.verspaeteterFlug === "secondZwischenstoppEndAirport")
    return `${zweiterZwischenstoppName} - ${endAirportName}`;
  if (userData.verspaeteterFlug === "secondAirportThirdZwischenstopp")
    return `${zweiterZwischenstoppName} - ${dritterZwischenstoppName}`;
  if (userData.verspaeteterFlug === "thirdZwischenstoppEndAirport")
    return `${dritterZwischenstoppName} - ${endAirportName}`;
};

function StopOverCards({
  userData,
  translations,
}: Readonly<ZwischenstoppsProps>) {
  if (!userData) return null;
  return (
    <>
      <SummaryDataOverviewCard
        title="Zwischenstopps"
        data={getZwischenStopps(userData)}
        buttonUrl={`${FLOW_ID}/flugdaten/zwischenstopp-uebersicht-${getAnzahlZwischenstopps(userData)}`}
        translations={translations}
      />
      {userData.verspaeteterFlug && (
        <SummaryDataOverviewCard
          title="Betroffener Flug"
          showValueHeading={false}
          data={{ verspaeteterFlug: getBetroffenerFlug(userData) }}
          buttonUrl={`${FLOW_ID}/flugdaten/verspaeteter-flug-${getAnzahlZwischenstopps(userData)}`}
          translations={translations}
        />
      )}
      {userData.anschlussFlugVerpasst && (
        <SummaryDataOverviewCard
          title="Verpasste Anschlussflüge"
          showValueHeading={false}
          data={{
            anschlussFlugVerpasst:
              userData.anschlussFlugVerpasst === "no"
                ? "Keine"
                : userData.anschlussFlugVerpasst,
          }}
          buttonUrl={`${FLOW_ID}/flugdaten/anschluss-flug-verpasst`}
          translations={translations}
        />
      )}
    </>
  );
}

export default StopOverCards;
