import EditButton from "@digitalservicebund/icons/CreateOutlined";
import type { Context } from "~/domains/contexts";
import { type Translations } from "~/services/translations/getTranslationByKey";
import Button from "./Button";
import Heading from "./Heading";

type SummaryDataProps = {
  readonly userData?: Context;
  readonly translations: Translations;
  readonly sortedFields?: string[];
};

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

const getUrlZwischenstopps = (userData: Context) => {
  const stopps = {
    oneStop: `/fluggastrechte/formular/flugdaten/zwischenstopp-uebersicht-1`,
    twoStop: `/fluggastrechte/formular/flugdaten/zwischenstopp-uebersicht-2`,
    threeStop: `/fluggastrechte/formular/flugdaten/zwischenstopp-uebersicht-3`,
  };
  return stopps[userData.zwischenstoppAnzahl as keyof typeof stopps];
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
  buttonUrl: string;
};

const Card = ({
  data,
  title,
  subtitle,
  showVariableName = true,
  buttonUrl,
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
        <Button
          iconLeft={<EditButton />}
          href={buttonUrl}
          look="tertiary"
          size="large"
          className="w-fit"
        >
          Bearbeiten
        </Button>
      </div>
    </div>
  );
};

type ZwischenstoppsProps = {
  userData: Context | undefined;
  buttonUrl: string;
};

const Zwischenstopps = ({ userData, buttonUrl }: ZwischenstoppsProps) => {
  if (!userData) return null;

  return (
    <>
      <Card
        title="Zwischenstops"
        data={getZwischenStops(userData)}
        buttonUrl={buttonUrl}
      />
      {userData.verspaeteterFlug && (
        <Card
          title="Betroffener Flug"
          showVariableName={false}
          data={{ verspaeteterFlug: userData.verspaeteterFlug }}
          buttonUrl={buttonUrl}
        />
      )}
      {userData.anschlussFlugVerpasst && (
        <Card
          title="Verpasste Anschlussflüge"
          data={{ anschlussFlugVerpasst: userData.anschlussFlugVerpasst }}
          buttonUrl="/fluggastrechte/formular/flugdaten/anschluss-flug-verpasst"
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
        buttonUrl="/fluggastrechte/formular/streitwert-kosten/prozesszinsen"
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
          buttonUrl=""
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
          buttonUrl=""
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
          buttonUrl=""
        />
      );
    }
  }
};

export default function SummaryDataOverview({ userData }: SummaryDataProps) {
  if (!userData || Object.keys(userData).length === 0) return null;

  return (
    <>
      <Heading
        text="Weitere Angaben"
        tagName="h2"
        look="ds-heading-03-bold"
        dataTestid="migration-field-value"
      />
      <Card
        buttonUrl="/fluggastrechte/formular/streitwert-kosten/prozesszinsen"
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
        buttonUrl="/fluggastrechte/formular/flugdaten/geplanter-flug"
        data={getFlugDaten(userData)}
        title="Ursprüngliche geplanter Flug"
      />
      {getZwischenStops(userData) && (
        <Zwischenstopps
          userData={userData}
          buttonUrl={getUrlZwischenstopps(userData)}
        />
      )}
      <TatsaechlicheAnkunft userData={userData} />
      <Card
        buttonUrl="/fluggastrechte/formular/flugdaten/zusaetzliche-angaben"
        data={{ zusätzlicheAngaben: userData.zusaetzlicheAngaben }}
        title="Zusätzliche Angaben zum Reiseverlauf"
      />

      {/* {Personendaten} */}
      <Heading
        text="Persönliche Daten"
        tagName="p"
        look="ds-heading-03-bold"
        dataTestid="migration-field-value"
      />
      <Card
        title="Klagende Person"
        data={getKlagendePerson(userData)}
        buttonUrl="/fluggastrechte/formular/persoenliche-daten/person/daten"
      />
      {userData.weiterePersonen &&
        (userData.weiterePersonen as Context[]).map((person, idx) => {
          return (
            <Card
              key={person.name as string}
              title={`Weitere Personen ${idx + 2}`}
              data={person}
              buttonUrl={`/fluggastrechte/formular/persoenliche-daten/weitere-personen/person/${idx}/daten`}
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
        buttonUrl="/fluggastrechte/formular/prozessfuehrung/schriftliches-verfahren"
      />
      <Card
        data={{ videoverhandlung: userData.videoverhandlung }}
        buttonUrl="/fluggastrechte/formular/prozessfuehrung/videoverhandlung"
      />
      <Card
        data={{ versaeumnisurteil: userData.versaeumnisurteil }}
        buttonUrl="/fluggastrechte/formular/prozessfuehrung/versaeumnisurteil"
      />
    </>
  );
}
