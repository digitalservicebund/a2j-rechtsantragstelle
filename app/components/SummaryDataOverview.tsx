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
  if (zwischenstop.zwischenstoppAnzahl === "noStop") {
    return undefined;
  }
  if (zwischenstop.zwischenstoppAnzahl === "oneStop") {
    return {
      ersterZwischenStopp: zwischenstop.ersterZwischenstopp ?? undefined,
    };
  }

  if (zwischenstop.zwischenstoppAnzahl === "twoStop") {
    return {
      ersterZwischenStopp: zwischenstop.ersterZwischenstopp ?? undefined,
      zweiterZwischenstopp: zwischenstop.zweiterZwischenstopp ?? undefined,
    };
  }

  if (zwischenstop.zwischenstoppAnzahl === "threeStop") {
    return {
      ersterZwischenStopp: zwischenstop.ersterZwischenstopp ?? undefined,
      zweiterZwischenstopp: zwischenstop.zweiterZwischenstopp ?? undefined,
      dritterZwischenstopp: zwischenstop.dritterZwischenstopp ?? undefined,
    };
  }
};

const getKlagendePerson = (userData: Context) => {
  return {
    klagendePerson: {
      anrede: userData.anrede,
      vorname: userData.vorname,
      nachname: userData.nachname,
      strasseHausnummer: userData.strasseHausnummer,
      plz: userData.plz,
      ort: userData.ort,
    },
  };
};

const getWeiterePersonen = (userData: Context) => {
  return {
    weiterePersonen: userData.weiterePersonen,
  };
};

const getWeitereAngaben = (userData: Context) => {
  return {
    prozesszinsen: userData.prozesszinsen,
  };
};

const getFlugDaten = (userData: Context) => {
  return {
    Flugnummer: userData.direktFlugnummer,
    buchung: userData.buchungsNummer,
    abflug: `${userData.direktAbflugsDatum} - ${userData.direktAbflugsZeit}`,
    ankunft: `${userData.direktAnkunftsDatum} - ${userData.direktAnkunftsZeit}`,
    zwischenstop: userData.zwischenstoppAnzahl,
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

const Card = (data: Context) => (
  <div className="first:pt-0 scroll-my-40">
    {Object.entries(data).map(([key, value]) => {
      return (
        <div key={key} className="space-y-16 bg-white pt-32 pb-44 px-32">
          <div className="first:pt-0 scroll-my-40">
            <Heading
              text={key}
              tagName="p"
              look="ds-label-01-bold"
              dataTestid="migration-field-value"
            />
            <p>{value as string}</p>
          </div>
        </div>
      );
    })}
  </div>
);

export default function SummaryDataOverview({
  userData,
  translations,
  buttonUrl,
}: SummaryDataProps) {
  if (!userData || Object.keys(userData).length === 0) return null;
  return (
    <>
      {/* {Object.entries(overData).map(([itemKey, itemValue]) => (
        <div key={itemKey} className="space-y-16 bg-white pt-32 pb-44 px-32">
          <Heading
            text={itemKey}
            tagName="p"
            look="ds-label-01-bold"
            dataTestid="migration-field-value"
          />
          <div className="first:pt-0 scroll-my-40">
            {Object.entries(itemValue).map(([key, value]) => {
              if (itemKey === "weiterePersonen") {
                return itemValue.map((person: Context) => {
                  
                  return Object.entries(person).map(([personKey, personValue]) => {
                    return <p key={personKey}>{personKey}: {personValue as string}</p>
                  })
                })
              }
              return <p key={key}>{key}: {value as string}</p>
            })}
          </div>
        </div>
      ))}

      {buttonUrl && (
        <Button href={buttonUrl} look="tertiary" size="large" className="w-fit">
          {getTranslationByKey(MIGRATION_BUTTON_TEXT_TRANSLATION, translations)}
        </Button>
      )} */}

      {/* Weitere Angaben */}
      <Heading
        text={"Weitere Angaben"}
        tagName="p"
        look="ds-label-01-bold"
        dataTestid="migration-field-value"
      />
      <Card {...getWeitereAngaben(userData)} />

      {/* Flugdaten */}
      <Heading
        text={"Flugdaten"}
        tagName="p"
        look="ds-label-01-bold"
        dataTestid="migration-field-value"
      />
      <Card {...getFlugDaten(userData)} />

      {/* Zwischenstops */}
      <Heading
        text={"Zwischenstops"}
        tagName="p"
        look="ds-label-01-bold"
        dataTestid="migration-field-value"
      />
      {getZwischenStops(userData) && <Card {...getZwischenStops(userData)} />}
    </>
  );
}
