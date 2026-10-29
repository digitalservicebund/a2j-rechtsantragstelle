import {
  commonFields,
  type KlageParteien,
  klageParteinArraySchema,
  naturalPersonGesetzlicheVertretungArt,
  naturalPersonSchema,
  organizationGesetzlicheVertretungArt,
  organizationSchema,
  vertretungFields,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";
import type { PageData } from "~/services/flow/pageData";
import { hiddenInputSchema } from "~/services/validation/hiddenInput";
import { schemaOrEmptyStringOptional } from "~/services/validation/schemaOrEmptyString";
import { klagendeProzessbevollmaechtigtePages } from "./prozessbevollmaechtigte/pages";

type KlagePartyDoneContext = {
  klagenden?: KlageParteien;
  pageData?: PageData;
};

export const klagendeParteiPages = {
  klagendeUebersicht: {
    stepId: "/klagende-partei/klagenden/uebersicht",
    arraySummary: {
      name: "klagenden",
      schema: klageParteinArraySchema,
      isArrayRelevant: () => true,
    },
  },
  klagendeNaturalPersonDaten: {
    stepId: "/klagende-partei/klagenden/#/natuerliche-person-daten",
    isRelevantForDone: ({ klagenden, pageData }: KlagePartyDoneContext) =>
      klagenden?.[pageData?.arrayIndexes?.[0] ?? -1]?.type !== "organisation",
    pageSchema: {
      "klagenden#anrede": naturalPersonSchema.shape.anrede,
      "klagenden#titel": naturalPersonSchema.shape.titel,
      "klagenden#vorname": naturalPersonSchema.shape.vorname,
      "klagenden#nachname": naturalPersonSchema.shape.nachname,
      "klagenden#strasse": naturalPersonSchema.shape.strasse,
      "klagenden#hausnummer": naturalPersonSchema.shape.hausnummer,
      "klagenden#plz": naturalPersonSchema.shape.plz,
      "klagenden#ort": naturalPersonSchema.shape.ort,
      "klagenden#land": naturalPersonSchema.shape.land,
      "klagenden#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(naturalPersonSchema.shape.type),
      ),
      "klagenden#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(commonFields.id),
      ),
    },
  },
  klagendeNaturalPersonGesetzlicheVertretungDaten: {
    stepId: "/klagende-partei/klagenden/#/gesetzliche-vertretung/#/daten",
    shouldCollapseIntoParentNavItem: true,
    isRelevantForDone: ({ klagenden, pageData }: KlagePartyDoneContext) =>
      klagenden?.[pageData?.arrayIndexes?.[0] ?? -1]?.type !== "organisation",
    pageSchema: {
      "klagenden#gesetzliche-vertretung#art":
        naturalPersonGesetzlicheVertretungArt,
      "klagenden#gesetzliche-vertretung#anrede": vertretungFields.anrede,
      "klagenden#gesetzliche-vertretung#titel": vertretungFields.titel,
      "klagenden#gesetzliche-vertretung#vorname": vertretungFields.vorname,
      "klagenden#gesetzliche-vertretung#nachname": vertretungFields.nachname,
      "klagenden#gesetzliche-vertretung#strasse": vertretungFields.strasse,
      "klagenden#gesetzliche-vertretung#hausnummer":
        vertretungFields.hausnummer,
      "klagenden#gesetzliche-vertretung#plz": vertretungFields.plz,
      "klagenden#gesetzliche-vertretung#ort": vertretungFields.ort,
      "klagenden#gesetzliche-vertretung#land": vertretungFields.land,
    },
  },
  klagendeOrganizationDaten: {
    stepId: "/klagende-partei/klagenden/#/organisation-daten",
    isRelevantForDone: ({ klagenden, pageData }: KlagePartyDoneContext) =>
      klagenden?.[pageData?.arrayIndexes?.[0] ?? -1]?.type !==
      "natuerliche-person",
    pageSchema: {
      "klagenden#orgName": organizationSchema.shape.orgName,
      "klagenden#strasse": organizationSchema.shape.strasse,
      "klagenden#hausnummer": organizationSchema.shape.hausnummer,
      "klagenden#plz": organizationSchema.shape.plz,
      "klagenden#ort": organizationSchema.shape.ort,
      "klagenden#land": organizationSchema.shape.land,
      "klagenden#orgVertretungArt": organizationSchema.shape.orgVertretungArt,
      "klagenden#orgVertretungAnrede":
        organizationSchema.shape.orgVertretungAnrede,
      "klagenden#orgVertretungTitel":
        organizationSchema.shape.orgVertretungTitel,
      "klagenden#orgVertretungVorname":
        organizationSchema.shape.orgVertretungVorname,
      "klagenden#orgVertretungNachname":
        organizationSchema.shape.orgVertretungNachname,
      "klagenden#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(organizationSchema.shape.type),
      ),
      "klagenden#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(commonFields.id),
      ),
    },
  },
  klagendeOrganizationGesetzlicheVertretungDaten: {
    stepId:
      "/klagende-partei/klagenden/#/gesetzliche-vertretung/#/daten-organisation",
    shouldCollapseIntoParentNavItem: true,
    isRelevantForDone: ({ klagenden, pageData }: KlagePartyDoneContext) =>
      klagenden?.[pageData?.arrayIndexes?.[0] ?? -1]?.type !==
      "natuerliche-person",
    pageSchema: {
      "klagenden#gesetzliche-vertretung#art":
        organizationGesetzlicheVertretungArt,
      "klagenden#gesetzliche-vertretung#anrede": vertretungFields.anrede,
      "klagenden#gesetzliche-vertretung#titel": vertretungFields.titel,
      "klagenden#gesetzliche-vertretung#vorname": vertretungFields.vorname,
      "klagenden#gesetzliche-vertretung#nachname": vertretungFields.nachname,
      "klagenden#gesetzliche-vertretung#strasse": vertretungFields.strasse,
      "klagenden#gesetzliche-vertretung#hausnummer":
        vertretungFields.hausnummer,
      "klagenden#gesetzliche-vertretung#plz": vertretungFields.plz,
      "klagenden#gesetzliche-vertretung#ort": vertretungFields.ort,
      "klagenden#gesetzliche-vertretung#land": vertretungFields.land,
    },
  },
  ...klagendeProzessbevollmaechtigtePages,
} as const satisfies PageConfigMap;
