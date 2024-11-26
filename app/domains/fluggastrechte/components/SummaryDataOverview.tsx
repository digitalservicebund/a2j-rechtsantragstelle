import Heading from "~/components/Heading";
import { type Translations } from "~/services/translations/getTranslationByKey";
import ActualArrivalCards from "./ActualArrivalCards";
import StopOverCards from "./StopOverCards";
import SummaryDataOverviewCard from "./SummaryDataOverviewCard";
import type { FluggastrechtContext } from "../formular/context";
import {
  getFlugDaten,
  getPersonData,
  getZeugenText,
} from "../services/summaryPage/getOverviewData";
import { getZwischenStopps } from "../services/summaryPage/stoppOver";

type SummaryDataProps = {
  readonly userData?: FluggastrechtContext;
  readonly translations: Translations;
};

export default function SummaryDataOverview({
  userData,
  translations,
}: SummaryDataProps) {
  if (!userData || Object.keys(userData).length === 0) return null;

  return (
    <>
      <Heading text="Weitere Angaben" tagName="h2" look="ds-heading-03-bold" />
      <SummaryDataOverviewCard
        buttonUrl="/fluggastrechte/formular/streitwert-kosten/prozesszinsen"
        data={{
          Prozesszinsen: userData.prozesszinsen,
        }}
        translations={translations}
      />

      {/* all about Flugdaten */}
      <Heading text="Flugdaten" tagName="p" look="ds-heading-03-bold" />
      <SummaryDataOverviewCard
        buttonUrl="/fluggastrechte/formular/flugdaten/geplanter-flug"
        data={getFlugDaten(userData)}
        title="Ursprüngliche geplanter Flug"
        translations={translations}
      />
      {getZwischenStopps(userData) && (
        <StopOverCards userData={userData} translations={translations} />
      )}
      <ActualArrivalCards userData={userData} translations={translations} />
      <SummaryDataOverviewCard
        buttonUrl="/fluggastrechte/formular/flugdaten/zusaetzliche-angaben"
        data={{ zusätzlicheAngaben: userData.zusaetzlicheAngaben }}
        title="Zusätzliche Angaben zum Reiseverlauf"
        translations={translations}
      />

      {/* {Personendaten} */}
      <Heading text="Persönliche Daten" tagName="p" look="ds-heading-03-bold" />
      <SummaryDataOverviewCard
        title="Klagende Person"
        data={getPersonData(userData)}
        buttonUrl="/fluggastrechte/formular/persoenliche-daten/person/daten"
        translations={translations}
      />
      {userData.weiterePersonen &&
        (userData.weiterePersonen as FluggastrechtContext[]).map(
          (person, idx) => {
            const data = getPersonData(person);
            return (
              <SummaryDataOverviewCard
                key={`Weitere Personen ${idx + 2}`}
                title={`Weitere Personen ${idx + 2}`}
                data={data}
                buttonUrl={`/fluggastrechte/formular/persoenliche-daten/weitere-personen/person/${idx}/daten`}
                translations={translations}
              />
            );
          },
        )}

      <SummaryDataOverviewCard
        title="Zeuginnen und Zeugen"
        data={{ zeugen: getZeugenText(userData) }}
        showValueHeading={false}
        buttonUrl="/fluggastrechte/formular/persoenliche-daten/person/daten"
        translations={translations}
      />

      {/* {Prozessführung} */}
      <Heading text="Prozessführung" tagName="p" look="ds-heading-03-bold" />
      <SummaryDataOverviewCard
        data={{ videoverhandlung: userData.videoverhandlung }}
        buttonUrl="/fluggastrechte/formular/prozessfuehrung/videoverhandlung"
        translations={translations}
      />
      <SummaryDataOverviewCard
        data={{ versaeumnisurteil: userData.versaeumnisurteil }}
        buttonUrl="/fluggastrechte/formular/prozessfuehrung/versaeumnisurteil"
        translations={translations}
      />
    </>
  );
}
