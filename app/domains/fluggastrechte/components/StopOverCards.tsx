import { type Translations } from "~/services/translations/getTranslationByKey";
import SummaryDataOverviewCard from "./SummaryDataOverviewCard";
import useDelayFlightAirports from "./useDelayFlightAirports";
import useStepOverAirports from "./useStepOverAirports";
import { type FluggastrechtContext } from "../formular/context";
import { FLOW_ID } from "../services/summaryPage/getOverviewData";
import {
  getAnzahlZwischenstopps,
  getZwischenStopps,
} from "../services/summaryPage/stoppOver";

type ZwischenstoppsProps = {
  readonly userData: FluggastrechtContext;
  readonly translations: Translations;
};

function StopOverCards({
  userData,
  translations,
}: Readonly<ZwischenstoppsProps>) {
  const delayFlightAirports = useDelayFlightAirports({
    ersterZwischenstopp: userData.ersterZwischenstopp ?? "",
    zweiterZwischenstopp: userData.zweiterZwischenstopp ?? "",
    dritterZwischenstopp: userData.dritterZwischenstopp ?? "",
    verspaeteterFlug: userData.verspaeteterFlug,
    startAirport: userData.startAirport ?? "",
    endAirport: userData.endAirport ?? "",
  });
  const stepOverAirports = useStepOverAirports(
    userData.ersterZwischenstopp ?? "",
    userData.zweiterZwischenstopp ?? "",
    userData.dritterZwischenstopp ?? "",
  );

  if (!userData) return null;
  return (
    <>
      <SummaryDataOverviewCard
        title="Zwischenstopps"
        data={getZwischenStopps(userData, stepOverAirports)}
        buttonUrl={`${FLOW_ID}/flugdaten/zwischenstopp-uebersicht-${getAnzahlZwischenstopps(userData)}`}
        translations={translations}
      />
      {userData.verspaeteterFlug && (
        <SummaryDataOverviewCard
          title="Betroffener Flug"
          showValueHeading={false}
          data={{ verspaeteterFlug: delayFlightAirports }}
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
