import Heading from "~/components/Heading";
import type { Context } from "~/domains/contexts";
import { type Translations } from "~/services/translations/getTranslationByKey";
import ActualArrivalCards from "./ActualArrivalCards";
import StopOverCards from "./StopOverCards";
import SummaryDataOverviewCard from "./SummaryDataOverviewCard";
import { getZwischenStops } from "../services/summaryPage/stoppOver";

type SummaryDataProps = {
  readonly userData?: Context;
  readonly translations: Translations;
  readonly sortedFields?: string[];
};

const getKlagendePerson = (userData: Context) => {
  return {
    anrede: userData.anrede,
    vorname: userData.vorname,
    nachname: userData.nachname,
    strasseHausnummer: userData.strasseHausnummer,
    plz: userData.plz,
    ort: userData.ort,
    telefonnummer: userData.telefonnummer,
    kontodaten: userData.iban
      ? `${userData.iban} \n ${userData.kontoinhaber}`
      : "",
  };
};

const getFlugDaten = (userData: Context) => {
  return {
    Flugnummer: userData.direktFlugnummer,
    Buchungsnummer: userData.buchungsNummer,
    Abflug: `${userData.direktAbflugsDatum} - ${userData.direktAbflugsZeit}`,
    Ankunft: `${userData.direktAnkunftsDatum} - ${userData.direktAnkunftsZeit}`,
    Zwischenstops: userData.zwischenstoppAnzahl,
  };
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
        data={getKlagendePerson(userData)}
        buttonUrl="/fluggastrechte/formular/persoenliche-daten/person/daten"
        translations={translations}
      />
      {userData.weiterePersonen &&
        (userData.weiterePersonen as Context[]).map((person, idx) => {
          return (
            <SummaryDataOverviewCard
              key={person.name as string}
              title={`Weitere Personen ${idx + 2}`}
              data={person}
              buttonUrl={`/fluggastrechte/formular/persoenliche-daten/weitere-personen/person/${idx}/daten`}
              translations={translations}
            />
          );
        })}

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
