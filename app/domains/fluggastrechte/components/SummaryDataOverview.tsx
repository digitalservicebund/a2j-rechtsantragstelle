import Heading from "~/components/Heading";
import { type Translations } from "~/services/translations/getTranslationByKey";
import ActualArrivalCards from "./ActualArrivalCards";
import AirlineDetailsOverviewCard from "./AirlineDetailsOverviewCard";
import StopOverCards from "./StopOverCards";
import StreitbeilegungCard from "./StreitbeilegungCard";
import SummaryDataOverviewCard from "./SummaryDataOverviewCard";
import useAirlineDetails from "./useAirlineDetails";
import type { FluggastrechtContext } from "../formular/context";
import {
  FLOW_ID,
  getFlugDaten,
  getFluggesellschaftDaten,
  getPersonData,
  getZeugenText,
  NO_SPECIFICATION,
} from "../services/summaryPage/getOverviewData";

type SummaryDataProps = {
  readonly userData?: FluggastrechtContext;
  readonly translations: Translations;
};
export default function SummaryDataOverview({
  userData,
  translations,
}: SummaryDataProps) {
  const airlineDetails = useAirlineDetails(userData?.fluggesellschaft);

  if (!userData || Object.keys(userData).length === 0) return null;

  return (
    <>
      <Heading text="Weitere Angaben" tagName="h2" look="ds-heading-03-bold" />
      <StreitbeilegungCard userData={userData} translations={translations} />
      <SummaryDataOverviewCard
        buttonUrl={`${FLOW_ID}/streitwert-kosten/prozesszinsen`}
        data={{
          prozesszinsen: userData.prozesszinsen,
        }}
        translations={translations}
      />

      <Heading text="Flugdaten" tagName="p" look="ds-heading-03-bold" />
      <AirlineDetailsOverviewCard
        buttonUrl={`${FLOW_ID}/flugdaten/adresse-fluggesellschaft`}
        data={{ ...airlineDetails, ...getFluggesellschaftDaten(userData) }}
        title="Adresse der Fluggesellschaft"
      />
      <SummaryDataOverviewCard
        buttonUrl={`${FLOW_ID}/flugdaten/geplanter-flug`}
        data={getFlugDaten(userData)}
        title="Ursprünglich geplanter Flug"
        translations={translations}
      />
      {userData.zwischenstoppAnzahl !== "no" && (
        <StopOverCards userData={userData} translations={translations} />
      )}
      <ActualArrivalCards userData={userData} translations={translations} />
      <SummaryDataOverviewCard
        buttonUrl={`${FLOW_ID}/flugdaten/zusaetzliche-angaben`}
        showValueHeading={false}
        data={{
          zusätzlicheAngaben:
            userData.zusaetzlicheAngaben === "" || !userData.zusaetzlicheAngaben
              ? NO_SPECIFICATION
              : userData.zusaetzlicheAngaben,
        }}
        title="Zusätzliche Angaben zum Reiseverlauf"
        translations={translations}
      />

      <Heading text="Persönliche Daten" tagName="p" look="ds-heading-03-bold" />
      <SummaryDataOverviewCard
        title="Klagende Person"
        data={getPersonData(userData)}
        buttonUrl={`${FLOW_ID}/persoenliche-daten/person/daten`}
        translations={translations}
      />
      {userData.weiterePersonen && (
        <>
          <Heading
            text="Weitere Personen"
            tagName="p"
            look="ds-label-01-bold"
          />
          {userData.weiterePersonen.map((person, idx) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { kontodaten, ...cedentData } = getPersonData(person);
            const cedentBookingNumber = {
              cedentBookingNumber:
                !person.buchungsnummer || person.buchungsnummer === ""
                  ? NO_SPECIFICATION
                  : person.buchungsnummer,
            };
            return (
              <SummaryDataOverviewCard
                key={`Weitere Personen ${idx + 2}`}
                title={`Person ${idx + 2}`}
                data={{ ...cedentBookingNumber, ...cedentData }}
                buttonUrl={`${FLOW_ID}/persoenliche-daten/weitere-personen/person/${idx}/daten`}
                translations={translations}
              />
            );
          })}
        </>
      )}

      <SummaryDataOverviewCard
        title="Zeuginnen und Zeugen"
        data={{ zeugen: getZeugenText(userData) }}
        showValueHeading={false}
        buttonUrl={`${FLOW_ID}/persoenliche-daten/weitere-personen/zeugen`}
        translations={translations}
      />

      <Heading text="Prozessführung" tagName="p" look="ds-heading-03-bold" />
      <SummaryDataOverviewCard
        data={{ videoverhandlung: userData.videoverhandlung }}
        buttonUrl={`${FLOW_ID}/prozessfuehrung/videoverhandlung`}
        translations={translations}
      />
      <SummaryDataOverviewCard
        data={{ versaeumnisurteil: userData.versaeumnisurteil }}
        buttonUrl={`${FLOW_ID}/prozessfuehrung/versaeumnisurteil`}
        translations={translations}
      />
    </>
  );
}
