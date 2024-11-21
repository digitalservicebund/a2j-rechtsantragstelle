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
    ...(userData.telefonnummer && { telefonnummer: userData.telefonnummer }),
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

const formatTextWithBreaks = (text: string) =>
  text.split("\n").map((line) => (
    <>
      {line}
      <br />
    </>
  ));

type CardProps = {
  data: Context | undefined;
  subtitle?: string;
  title?: string;
  showVariableName?: boolean;
};

const Card = ({
  data,
  title,
  subtitle,
  showVariableName = true,
}: CardProps) => {
  if (!data) return;
  return (
    <div className="first:pt-0 scroll-my-40">
      <div className="space-y-16 bg-white pt-32 pb-44 px-32">
        {title && (
          <Heading
            text={title}
            tagName="p"
            look="ds-heading-03-bold"
            dataTestid="migration-field-value"
          />
        )}
        {subtitle}
        {Object.entries(data).map(([key, value]) => {
          return (
            <div key={key} className="first:pt-0 scroll-my-40">
              {showVariableName && (
                <Heading
                  text={key}
                  tagName="p"
                  look="ds-label-01-bold"
                  dataTestid="migration-field-value"
                />
              )}
              {formatTextWithBreaks(value as string)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

type ZwischenstoppsProps = {
  userData: Context | undefined;
};

const Zwischenstopps = ({ userData }: ZwischenstoppsProps) => {
  if (!userData) return null;
  return (
    <>
      <Card title="Zwischenstops" data={getZwischenStops(userData)} />
      {userData.verspaeteterFlug && (
        <Card
          title="Betroffener Flug"
          showVariableName={false}
          data={{ verspaeteterFlug: userData.verspaeteterFlug }}
        />
      )}
      {userData.anschlussFlugVerpasst && (
        <Card
          title="Verpasste Anschlussflüge"
          data={{ anschlussFlugVerpasst: userData.anschlussFlugVerpasst }}
        />
      )}
    </>
  );
};

const TatsaechlicheAnkunft = ({ userData }: { userData: Context }) => {
  if (userData.tatsaechlicherFlug === "yes") {
    return (
      <Card
        title="Tatsächliche Ankunft"
        subtitle="(Mit dem ursprünglich geplanten Flug)"
        data={{
          Ankunft: `${userData.tatsaechlicherAnkunftsDatum} - ${userData.tatsaechlicherAnkunftsZeit}`,
        }}
      />
    );
  }
  if (userData.tatsaechlicherFlug === "no") {
    if (userData.ersatzverbindungArt === "flug") {
      return (
        <Card
          title="Tatsächliche Ankunft"
          subtitle="(Mit einem anderen Flug)"
          data={{
            flugnummer: userData.ersatzFlugnummer,
            ankunft: `${userData.ersatzFlugAnkunftsDatum} \n ${userData.ersatzFlugAnkunftsZeit}`,
          }}
        />
      );
    }
    if (userData.ersatzverbindungArt === "etwasAnderes") {
      return (
        <Card
          title="Tatsächliche Ankunft"
          subtitle="(Mit Bahn, Bus oder anderen Verkehrsmitteln)"
          data={{
            andereErsatzverbindungBeschreibung:
              userData.andereErsatzverbindungBeschreibung,
            ankunft: `${userData.tatsaechlicherAnkunftsDatum} \n ${userData.tatsaechlicherAnkunftsZeit}`,
          }}
        />
      );
    }
    if (userData.ersatzverbindungArt === "keineAnkunft") {
      return (
        <Card
          title="Tatsächliche Ankunft"
          showVariableName={false}
          data={{
            keineAnkunft: "gar nicht angekommen",
          }}
        />
      );
    }
  }
};

export default function SummaryDataOverview({
  userData,
  translations,
  buttonUrl,
}: SummaryDataProps) {
  if (!userData || Object.keys(userData).length === 0) return null;
  // console.log({ userData });
  // console.log({ translations });
  return (
    <>
      <Heading
        text="Weitere Angaben"
        tagName="h2"
        look="ds-heading-03-bold"
        dataTestid="migration-field-value"
      />
      <Card
        data={{
          Prozesszinsen: userData.prozesszinsen,
        }}
      />

      {/* all about Flugdaten */}
      <Heading
        text="Flugdaten"
        tagName="p"
        look="ds-heading-03-bold"
        dataTestid="migration-field-value"
      />
      <Card
        title="Ursprüngliche geplanter Flug"
        data={getFlugDaten(userData)}
      />
      {getZwischenStops(userData) && <Zwischenstopps userData={userData} />}
      <TatsaechlicheAnkunft userData={userData} />
      <Card
        title="Zusätzliche Angaben zum Reiseverlauf"
        data={{ zusätzlicheAngaben: userData.zusaetzlicheAngaben }}
      />

      {/* {Personendaten} */}
      <Heading
        text="Persönliche Daten"
        tagName="p"
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

      {/* {Prozessführung} */}
      <Heading
        text="Prozessführung"
        tagName="p"
        look="ds-heading-03-bold"
        dataTestid="migration-field-value"
      />
      <Card
        data={{ schriftlichesVerfahren: userData.schriftlichesVerfahren }}
      />
      <Card data={{ videoverhandlung: userData.videoverhandlung }} />
      <Card data={{ versaeumnisurteil: userData.versaeumnisurteil }} />
    </>
  );
}
