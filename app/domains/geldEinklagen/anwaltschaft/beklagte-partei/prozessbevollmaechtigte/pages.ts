import {
  einzelkanzleiSchema,
  berufsausuebungsgesellschaftSchema,
  prozessbevollmaechtigteArraySchema,
  type Prozessbevollmaechtigte,
  signaturangabenArraySchema,
} from "../../shared/prozessbevollmaechtigte/prozessbevollmaechtigteSchemas";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";
import { type PageData } from "~/services/flow/pageData";
import { hiddenInputSchema } from "~/services/validation/hiddenInput";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { schemaOrEmptyStringOptional } from "~/services/validation/schemaOrEmptyString";

type DoneContext = {
  beklagteProzessbevollmaechtigte?: Prozessbevollmaechtigte;
  pageData?: PageData;
};

const einzelkanzlei = einzelkanzleiSchema.shape;
const gesellschaft = berufsausuebungsgesellschaftSchema.shape;

export const beklagteProzessbevollmaechtigtePages = {
  beklagteProzessbevollmaechtigteUebersicht: {
    stepId: "/beklagte-partei/prozessbevollmaechtigte/uebersicht",
    arraySummary: {
      name: "beklagteProzessbevollmaechtigte",
      schema: prozessbevollmaechtigteArraySchema,
      isArrayRelevant: ({ beklagteProzessbevollmaechtigte }: DoneContext) =>
        Boolean(beklagteProzessbevollmaechtigte?.length),
    },
  },
  beklagteProzessbevollmaechtigteEinzelkanzleiDaten: {
    stepId: "/beklagte-partei/prozessbevollmaechtigte/#/einzelkanzlei-daten",
    isRelevantForDone: ({
      beklagteProzessbevollmaechtigte,
      pageData,
    }: DoneContext) =>
      Boolean(beklagteProzessbevollmaechtigte?.length) &&
      beklagteProzessbevollmaechtigte?.[pageData?.arrayIndexes?.[0] ?? -1]
        ?.type !== "berufsausuebungsgesellschaft",
    pageSchema: {
      "beklagteProzessbevollmaechtigte#name": einzelkanzlei.name,
      "beklagteProzessbevollmaechtigte#geschaeftszeichen":
        einzelkanzlei.geschaeftszeichen,
      "beklagteProzessbevollmaechtigte#telefonnummer":
        einzelkanzlei.telefonnummer,
      "beklagteProzessbevollmaechtigte#email": einzelkanzlei.email,
      "beklagteProzessbevollmaechtigte#berufsbezeichnung":
        einzelkanzlei.berufsbezeichnung,
      "beklagteProzessbevollmaechtigte#anrede": einzelkanzlei.anrede,
      "beklagteProzessbevollmaechtigte#titel": einzelkanzlei.titel,
      "beklagteProzessbevollmaechtigte#vorname": einzelkanzlei.vorname,
      "beklagteProzessbevollmaechtigte#nachname": einzelkanzlei.nachname,
      "beklagteProzessbevollmaechtigte#strasse": einzelkanzlei.strasse,
      "beklagteProzessbevollmaechtigte#hausnummer": einzelkanzlei.hausnummer,
      "beklagteProzessbevollmaechtigte#plz": einzelkanzlei.plz,
      "beklagteProzessbevollmaechtigte#ort": einzelkanzlei.ort,
      "beklagteProzessbevollmaechtigte#land": einzelkanzlei.land,
      "beklagteProzessbevollmaechtigte#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(einzelkanzlei.type),
      ),
      "beklagteProzessbevollmaechtigte#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(einzelkanzlei.id),
      ),
    },
  },
  beklagteProzessbevollmaechtigteBerufsausuebungsgesellschaftDaten: {
    stepId:
      "/beklagte-partei/prozessbevollmaechtigte/#/berufsausuebungsgesellschaft-daten",
    isRelevantForDone: ({
      beklagteProzessbevollmaechtigte,
      pageData,
    }: DoneContext) =>
      Boolean(beklagteProzessbevollmaechtigte?.length) &&
      beklagteProzessbevollmaechtigte?.[pageData?.arrayIndexes?.[0] ?? -1]
        ?.type !== "einzelkanzlei",
    pageSchema: {
      "beklagteProzessbevollmaechtigte#name": gesellschaft.name,
      "beklagteProzessbevollmaechtigte#geschaeftszeichen":
        gesellschaft.geschaeftszeichen,
      "beklagteProzessbevollmaechtigte#telefonnummer":
        gesellschaft.telefonnummer,
      "beklagteProzessbevollmaechtigte#email": gesellschaft.email,
      "beklagteProzessbevollmaechtigte#isProzessbevollmaechtigt":
        checkedOptional,
      "beklagteProzessbevollmaechtigte#strasse": gesellschaft.strasse,
      "beklagteProzessbevollmaechtigte#hausnummer": gesellschaft.hausnummer,
      "beklagteProzessbevollmaechtigte#plz": gesellschaft.plz,
      "beklagteProzessbevollmaechtigte#ort": gesellschaft.ort,
      "beklagteProzessbevollmaechtigte#land": gesellschaft.land,
      "beklagteProzessbevollmaechtigte#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(gesellschaft.type),
      ),
      "beklagteProzessbevollmaechtigte#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(gesellschaft.id),
      ),
    },
  },
  beklagteSignaturangabenDaten: {
    stepId:
      "/beklagte-partei/prozessbevollmaechtigte/#/signaturangaben/#/daten",
    isRelevantForDone: ({
      beklagteProzessbevollmaechtigte,
      pageData,
    }: DoneContext) => {
      const prozessbevollmaechtigte =
        beklagteProzessbevollmaechtigte?.[pageData?.arrayIndexes?.[0] ?? -1];
      return (
        prozessbevollmaechtigte?.type === "berufsausuebungsgesellschaft" &&
        prozessbevollmaechtigte?.isProzessbevollmaechtigt === "on"
      );
    },
    pageSchema: {
      "beklagteProzessbevollmaechtigte#signaturangaben#titel":
        signaturangabenArraySchema.element.shape.titel,
      "beklagteProzessbevollmaechtigte#signaturangaben#vorname":
        signaturangabenArraySchema.element.shape.vorname,
      "beklagteProzessbevollmaechtigte#signaturangaben#nachname":
        signaturangabenArraySchema.element.shape.nachname,
      "beklagteProzessbevollmaechtigte#signaturangaben#berufsbezeichnung":
        signaturangabenArraySchema.element.shape.berufsbezeichnung,
    },
  },
} as const satisfies PageConfigMap;
