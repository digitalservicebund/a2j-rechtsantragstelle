import type { Context } from "~/domains/contexts";
import { type Translations } from "~/services/translations/getTranslationByKey";
import { lookupOrKey } from "~/util/lookupOrKey";
import Heading from "./Heading";

type SummaryDataProps = {
  readonly userData?: Context;
  readonly translations: Translations;
  readonly sortedFields?: string[];
  readonly buttonUrl?: string;
};
type ValueOfContext = Context[keyof Context];

const getZwischenStops = (zwischenstop: Context) => {
  const stopMapping = {
    noStop: undefined,
    oneStop: {
      ersterZwischenStopp: zwischenstop.ersterZwischenstopp ?? undefined,
    },
    twoStop: {
      ersterZwischenStopp: zwischenstop.ersterZwischenstopp ?? undefined,
      zweiterZwischenstopp: zwischenstop.zweiterZwischenstopp ?? undefined,
    },
    threeStop: {
      ersterZwischenStopp: zwischenstop.ersterZwischenstopp ?? undefined,
      zweiterZwischenstopp: zwischenstop.zweiterZwischenstopp ?? undefined,
      dritterZwischenstopp: zwischenstop.dritterZwischenstopp ?? undefined,
    },
  } as const;

  return stopMapping[
    zwischenstop.zwischenstoppAnzahl as keyof typeof stopMapping
  ];
};

const getKlagendePerson = (userData: Context) => {
  return {
    anrede: userData.anrede,
    vorname: userData.vorname,
    nachname: userData.nachname,
    strasseHausnummer: userData.strasseHausnummer,
    plz: userData.plz,
    ort: userData.ort,
  };
};

const getWeiterePersonen = (userData: Context) => {
  return {
    weiterePersonen: userData.weiterePersonen,
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

const renderMigrationValue = (
  translations: Translations,
  value: ValueOfContext,
  key: string,
) => {
  if (typeof value === "object" && value !== null) {
    console.log("value", value);
    return Object.entries(value).map(([_, subValue]) => (
      <p key={subValue as string}>
        {lookupOrKey(subValue as string, translations)}
      </p>
    ));
  }

  const translation = translations[`${key}.${value}`];

  if (typeof translation === "undefined") {
    return translations[`${key}.value`];
  }

  return translation;
};

type CardProps = {
  data: Context | undefined;
  subtitle?: string;
  title: string;
};

const Card = ({ data, title, subtitle }: CardProps) => {
  if (!data) return;
  return (
    <div className="first:pt-0 scroll-my-40">
      <div className="space-y-16 bg-white pt-32 pb-44 px-32">
        <Heading
          text={title}
          tagName="p"
          look="ds-heading-03-bold"
          dataTestid="migration-field-value"
        />
        {subtitle}
        {Object.entries(data).map(([key, value]) => {
          return (
            <div key={key} className="first:pt-0 scroll-my-40">
              <Heading
                text={key}
                tagName="p"
                look="ds-label-01-bold"
                dataTestid="migration-field-value"
              />
              {value as string}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function SummaryDataOverview({
  userData,
  translations,
  buttonUrl,
}: SummaryDataProps) {
  if (!userData || Object.keys(userData).length === 0) return null;
  console.log({ userData });
  console.log({ translations });
  return (
    <>
      <Card
        title="Weitere Angaben"
        data={{
          Prozesszinsen: userData.prozesszinsen,
        }}
      />

      {/* all about Flugdaten */}
      <Heading
        text="Flugdaten"
        tagName="h3"
        look="ds-heading-03-bold"
        dataTestid="migration-field-value"
      />
      <Card
        title="Ursprüngliche geplanter Flug"
        data={getFlugDaten(userData)}
      />
      {getZwischenStops(userData) && (
        <Card title="Zwischenstops" data={getZwischenStops(userData)} />
      )}
      {userData.verspaeteterFlug && (
        <Card
          title="Betroffener Flug"
          data={{ verspaeteterFlug: userData.verspaeteterFlug }}
        />
      )}
      {userData.anschlussFlugVerpasst && (
        <Card
          title="Verspäteter Flug"
          data={{ anschlussFlugVerpasst: userData.anschlussFlugVerpasst }}
        />
      )}
      {userData.tatsaechlicherFlug === "yes" && (
        <Card
          title="Tatsächliche Ankunft"
          subtitle="(Mit dem ursprünglich geplanten Flug)"
          data={{
            Ankunft: `${userData.tatsaechlicherAnkunftsDatum} - ${userData.tatsaechlicherAnkunftsZeit}`,
          }}
        />
      )}

      {/* {Personendaten} */}
      <Heading
        text="Persönliche Daten"
        tagName="h3"
        look="ds-heading-03-bold"
        dataTestid="migration-field-value"
      />
      <Card title="Klagende Person" data={getKlagendePerson(userData)} />
      {userData.weiterePersonen &&
        (userData.weiterePersonen as Context[]).map((person, idx) => {
          return (
            <Card
              key={person.name as string}
              title={`Weitere Personen ${idx + 2}`}
              data={person}
            />
          );
        })}
    </>
  );
}
