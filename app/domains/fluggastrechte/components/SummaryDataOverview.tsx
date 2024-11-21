import Heading from "~/components/Heading";
import type { FluggastrechtContext } from "../formular/context";
import { type Translations } from "~/services/translations/getTranslationByKey";
import ActualArrivalCards from "./ActualArrivalCards";
import StopOverCards from "./StopOverCards";
import SummaryDataOverviewCard from "./SummaryDataOverviewCard";
import { getZwischenStops } from "../services/summaryPage/stoppOver";

type SummaryDataProps = {
  userData?: FluggastrechtContext;
  translations: Translations;
};

const getStringWithSpaceIfStringExists = (value: string | undefined) => {
  return value ? `${value} ` : "";
};

const getPersonData = (userData: FluggastrechtContext) => {
  return {
    klagendePerson: `${getStringWithSpaceIfStringExists(userData.anrede) + getStringWithSpaceIfStringExists(userData.vorname) + getStringWithSpaceIfStringExists(userData.nachname)}`,
    strasseHausnummer: userData.strasseHausnummer,
    plzOrt: `${userData.plz} ${userData.ort}`,
    telefonnummer: userData.telefonnummer,
    kontodaten: userData.iban
      ? `${userData.iban} \n ${userData.kontoinhaber}`
      : "",
  };
};

const getFlugDaten = (userData: FluggastrechtContext) => {
  return {
    Flugnummer: userData.direktFlugnummer,
    Buchungsnummer: userData.buchungsNummer,
    Abflug: `${userData.direktAbflugsDatum} - ${userData.direktAbflugsZeit}`,
    Ankunft: `${userData.direktAnkunftsDatum} - ${userData.direktAnkunftsZeit}`,
    Zwischenstops: userData.zwischenstoppAnzahl,
  };
};

const getZeugenText = (userData: FluggastrechtContext) => {
  if (userData.hasZeugen === "no") return "noWitnesses";
  if (userData.isWeiterePersonen) return "cedentsAndWitnesses";
  return "noCedentsAndWitnesses";
};

export default function SummaryDataOverview({
  userData,
  translations,
}: SummaryDataProps) {
  if (!userData || Object.keys(userData).length === 0) return null;

  return (
    <>
      <Heading
        text="Weitere Angaben"
        tagName="h2"
        look="ds-heading-03-bold"
        dataTestid="migration-field-value"
      />
      <SummaryDataOverviewCard
        buttonUrl="/fluggastrechte/formular/streitwert-kosten/prozesszinsen"
        data={{
          Prozesszinsen: userData.prozesszinsen,
        }}
        translations={translations}
      />

      {/* all about Flugdaten */}
      <Heading
        text="Flugdaten"
        tagName="p"
        look="ds-heading-03-bold"
        dataTestid="migration-field-value"
      />
      <SummaryDataOverviewCard
        buttonUrl="/fluggastrechte/formular/flugdaten/geplanter-flug"
        data={getFlugDaten(userData)}
        title="Ursprüngliche geplanter Flug"
        translations={translations}
      />
      {getZwischenStops(userData) && (
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
      <Heading
        text="Persönliche Daten"
        tagName="p"
        look="ds-heading-03-bold"
        dataTestid="migration-field-value"
      />
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
        data={{ Zeugen: getZeugenText(userData) }}
        showVariableName={false}
        buttonUrl="/fluggastrechte/formular/persoenliche-daten/person/daten"
        translations={translations}
      />

      {/* {Prozessführung} */}
      <Heading
        text="Prozessführung"
        tagName="p"
        look="ds-heading-03-bold"
        dataTestid="migration-field-value"
      />
      <SummaryDataOverviewCard
        data={{ schriftlichesVerfahren: userData.schriftlichesVerfahren }}
        buttonUrl="/fluggastrechte/formular/prozessfuehrung/schriftliches-verfahren"
        translations={translations}
      />
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
