import {
  einzelkanzleiSchema,
  berufsausuebungsgesellschaftSchema,
  prozessbevollmaechtigteArraySchema,
  type KlagendeProzessbevollmaechtigte,
  verantwortendePersonSchema,
} from "../../shared/klageParties/prozessbevollmaechtigte/prozessbevollmaechtigteSchemas";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";
import { type PageData } from "~/services/flow/pageData";
import { hiddenInputSchema } from "~/services/validation/hiddenInput";
import { schemaOrEmptyStringOptional } from "~/services/validation/schemaOrEmptyString";

type DoneContext = {
  klagendeProzessbevollmaechtigte?: KlagendeProzessbevollmaechtigte;
  pageData?: PageData;
};

const einzelkanzlei = einzelkanzleiSchema.shape;
const gesellschaft = berufsausuebungsgesellschaftSchema.shape;

export const klagendeProzessbevollmaechtigtePages = {
  klagendeProzessbevollmaechtigteUebersicht: {
    stepId: "/klagende-partei/prozessbevollmaechtigte/uebersicht",
    arraySummary: {
      name: "klagendeProzessbevollmaechtigte",
      schema: prozessbevollmaechtigteArraySchema,
      isArrayRelevant: () => true,
    },
  },
  klagendeProzessbevollmaechtigteEinzelkanzleiDaten: {
    stepId: "/klagende-partei/prozessbevollmaechtigte/#/einzelkanzlei-daten",
    isRelevantForDone: ({
      klagendeProzessbevollmaechtigte,
      pageData,
    }: DoneContext) =>
      klagendeProzessbevollmaechtigte?.[pageData?.arrayIndexes?.[0] ?? -1]
        ?.type !== "berufsausuebungsgesellschaft",
    pageSchema: {
      "klagendeProzessbevollmaechtigte#name": einzelkanzlei.name,
      "klagendeProzessbevollmaechtigte#geschaeftszeichen":
        einzelkanzlei.geschaeftszeichen,
      "klagendeProzessbevollmaechtigte#strasse": einzelkanzlei.strasse,
      "klagendeProzessbevollmaechtigte#hausnummer": einzelkanzlei.hausnummer,
      "klagendeProzessbevollmaechtigte#plz": einzelkanzlei.plz,
      "klagendeProzessbevollmaechtigte#ort": einzelkanzlei.ort,
      "klagendeProzessbevollmaechtigte#land": einzelkanzlei.land,
      "klagendeProzessbevollmaechtigte#telefonnummer":
        einzelkanzlei.telefonnummer,
      "klagendeProzessbevollmaechtigte#email": einzelkanzlei.email,
      "klagendeProzessbevollmaechtigte#anrede": einzelkanzlei.anrede,
      "klagendeProzessbevollmaechtigte#titel": einzelkanzlei.titel,
      "klagendeProzessbevollmaechtigte#vorname": einzelkanzlei.vorname,
      "klagendeProzessbevollmaechtigte#nachname": einzelkanzlei.nachname,
      "klagendeProzessbevollmaechtigte#berufsbezeichnung":
        einzelkanzlei.berufsbezeichnung,
      "klagendeProzessbevollmaechtigte#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(einzelkanzlei.type),
      ),
      "klagendeProzessbevollmaechtigte#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(einzelkanzlei.id),
      ),
    },
  },
  klagendeProzessbevollmaechtigteBerufsausuebungsgesellschaftDaten: {
    stepId:
      "/klagende-partei/prozessbevollmaechtigte/#/berufsausuebungsgesellschaft-daten",
    isRelevantForDone: ({
      klagendeProzessbevollmaechtigte,
      pageData,
    }: DoneContext) =>
      klagendeProzessbevollmaechtigte?.[pageData?.arrayIndexes?.[0] ?? -1]
        ?.type !== "einzelkanzlei",
    pageSchema: {
      "klagendeProzessbevollmaechtigte#name": gesellschaft.name,
      "klagendeProzessbevollmaechtigte#geschaeftszeichen":
        gesellschaft.geschaeftszeichen,
      "klagendeProzessbevollmaechtigte#strasse": gesellschaft.strasse,
      "klagendeProzessbevollmaechtigte#hausnummer": gesellschaft.hausnummer,
      "klagendeProzessbevollmaechtigte#plz": gesellschaft.plz,
      "klagendeProzessbevollmaechtigte#ort": gesellschaft.ort,
      "klagendeProzessbevollmaechtigte#land": gesellschaft.land,
      "klagendeProzessbevollmaechtigte#telefonnummer":
        gesellschaft.telefonnummer,
      "klagendeProzessbevollmaechtigte#email": gesellschaft.email,
      "klagendeProzessbevollmaechtigte#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(gesellschaft.type),
      ),
      "klagendeProzessbevollmaechtigte#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(gesellschaft.id),
      ),
    },
  },
  verantwortendePersonenDaten: {
    stepId:
      "/klagende-partei/prozessbevollmaechtigte/#/verantwortende-personen/#/daten",
    shouldCollapseIntoParentNavItem: true,
    isRelevantForDone: ({
      klagendeProzessbevollmaechtigte,
      pageData,
    }: DoneContext) => {
      const prozessbevollmaechtigte =
        klagendeProzessbevollmaechtigte?.[pageData?.arrayIndexes?.[0] ?? -1];
      return prozessbevollmaechtigte?.type === "berufsausuebungsgesellschaft";
    },
    pageSchema: {
      "klagendeProzessbevollmaechtigte#verantwortende-personen#titel":
        verantwortendePersonSchema.shape.titel,
      "klagendeProzessbevollmaechtigte#verantwortende-personen#vorname":
        verantwortendePersonSchema.shape.vorname,
      "klagendeProzessbevollmaechtigte#verantwortende-personen#nachname":
        verantwortendePersonSchema.shape.nachname,
      "klagendeProzessbevollmaechtigte#verantwortende-personen#berufsbezeichnung":
        verantwortendePersonSchema.shape.berufsbezeichnung,
    },
  },
} as const satisfies PageConfigMap;
