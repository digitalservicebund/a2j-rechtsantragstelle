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

type BeklagtePartyDoneContext = {
  beklagten?: KlageParteien;
  pageData?: PageData;
};

export const beklagteParteiPages = {
  beklagteUebersicht: {
    stepId: "/beklagte-partei/beklagten/uebersicht",
    arraySummary: {
      name: "beklagten",
      schema: klageParteinArraySchema,
      isArrayRelevant: () => true,
    },
  },
  beklagteNaturalPersonDaten: {
    stepId: "/beklagte-partei/beklagten/#/natuerliche-person-daten",
    isRelevantForDone: ({ beklagten, pageData }: BeklagtePartyDoneContext) =>
      beklagten?.[pageData?.arrayIndexes?.[0] ?? -1]?.type !== "organisation",
    pageSchema: {
      "beklagten#anrede": naturalPersonSchema.shape.anrede,
      "beklagten#titel": naturalPersonSchema.shape.titel,
      "beklagten#vorname": naturalPersonSchema.shape.vorname,
      "beklagten#nachname": naturalPersonSchema.shape.nachname,
      "beklagten#strasse": naturalPersonSchema.shape.strasse,
      "beklagten#hausnummer": naturalPersonSchema.shape.hausnummer,
      "beklagten#plz": naturalPersonSchema.shape.plz,
      "beklagten#ort": naturalPersonSchema.shape.ort,
      "beklagten#land": naturalPersonSchema.shape.land,
      "beklagten#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(naturalPersonSchema.shape.type),
      ),
      "beklagten#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(commonFields.id),
      ),
    },
  },
  beklagteNaturalPersonGesetzlicheVertretungDaten: {
    stepId: "/beklagte-partei/beklagten/#/gesetzliche-vertretung/#/daten",
    shouldCollapseIntoParentNavItem: true,
    isRelevantForDone: ({ beklagten, pageData }: BeklagtePartyDoneContext) =>
      beklagten?.[pageData?.arrayIndexes?.[0] ?? -1]?.type !== "organisation",
    pageSchema: {
      "beklagten#gesetzliche-vertretung#art":
        naturalPersonGesetzlicheVertretungArt,
      "beklagten#gesetzliche-vertretung#anrede": vertretungFields.anrede,
      "beklagten#gesetzliche-vertretung#titel": vertretungFields.titel,
      "beklagten#gesetzliche-vertretung#vorname": vertretungFields.vorname,
      "beklagten#gesetzliche-vertretung#nachname": vertretungFields.nachname,
      "beklagten#gesetzliche-vertretung#strasse": vertretungFields.strasse,
      "beklagten#gesetzliche-vertretung#hausnummer":
        vertretungFields.hausnummer,
      "beklagten#gesetzliche-vertretung#plz": vertretungFields.plz,
      "beklagten#gesetzliche-vertretung#ort": vertretungFields.ort,
      "beklagten#gesetzliche-vertretung#land": vertretungFields.land,
    },
  },
  beklagteOrganizationDaten: {
    stepId: "/beklagte-partei/beklagten/#/organisation-daten",
    isRelevantForDone: ({ beklagten, pageData }: BeklagtePartyDoneContext) =>
      beklagten?.[pageData?.arrayIndexes?.[0] ?? -1]?.type !==
      "natuerliche-person",
    pageSchema: {
      "beklagten#orgName": organizationSchema.shape.orgName,
      "beklagten#strasse": organizationSchema.shape.strasse,
      "beklagten#hausnummer": organizationSchema.shape.hausnummer,
      "beklagten#plz": organizationSchema.shape.plz,
      "beklagten#ort": organizationSchema.shape.ort,
      "beklagten#land": organizationSchema.shape.land,
      "beklagten#orgVertretungArt": organizationSchema.shape.orgVertretungArt,
      "beklagten#orgVertretungAnrede":
        organizationSchema.shape.orgVertretungAnrede,
      "beklagten#orgVertretungTitel":
        organizationSchema.shape.orgVertretungTitel,
      "beklagten#orgVertretungVorname":
        organizationSchema.shape.orgVertretungVorname,
      "beklagten#orgVertretungNachname":
        organizationSchema.shape.orgVertretungNachname,
      "beklagten#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(organizationSchema.shape.type),
      ),
      "beklagten#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(commonFields.id),
      ),
    },
  },
  beklagteOrganizationGesetzlicheVertretungDaten: {
    stepId:
      "/beklagte-partei/beklagten/#/gesetzliche-vertretung/#/daten-organisation",
    shouldCollapseIntoParentNavItem: true,
    isRelevantForDone: ({ beklagten, pageData }: BeklagtePartyDoneContext) =>
      beklagten?.[pageData?.arrayIndexes?.[0] ?? -1]?.type !==
      "natuerliche-person",
    pageSchema: {
      "beklagten#gesetzliche-vertretung#art":
        organizationGesetzlicheVertretungArt,
      "beklagten#gesetzliche-vertretung#anrede": vertretungFields.anrede,
      "beklagten#gesetzliche-vertretung#titel": vertretungFields.titel,
      "beklagten#gesetzliche-vertretung#vorname": vertretungFields.vorname,
      "beklagten#gesetzliche-vertretung#nachname": vertretungFields.nachname,
      "beklagten#gesetzliche-vertretung#strasse": vertretungFields.strasse,
      "beklagten#gesetzliche-vertretung#hausnummer":
        vertretungFields.hausnummer,
      "beklagten#gesetzliche-vertretung#plz": vertretungFields.plz,
      "beklagten#gesetzliche-vertretung#ort": vertretungFields.ort,
      "beklagten#gesetzliche-vertretung#land": vertretungFields.land,
    },
  },
} as const satisfies PageConfigMap;
