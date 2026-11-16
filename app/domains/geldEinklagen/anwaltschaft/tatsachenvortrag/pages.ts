import {
  absaetzeArraySchema,
  augenscheinSchema,
  beweismittelSchema,
  parteivernehmungSchema,
  sachverstaendigengutachtenSchema,
  urkundeSchema,
  vortraegeArraySchema,
  zeugeSchema,
} from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";
import { hiddenInputSchema } from "~/services/validation/hiddenInput";
import { schemaOrEmptyStringOptional } from "~/services/validation/schemaOrEmptyString";
import { stringRequiredMaxSchema } from "~/services/validation/stringRequired";

export const tatsachenvortragPages = {
  antraegeUebersicht: {
    stepId: "/tatsachenvortrag-beweise/uebersicht",
    arraySummary: {
      name: "vortraege",
      schema: vortraegeArraySchema,
      isArrayRelevant: () => true,
    },
  },
  // Never shown: the add-vortrag action creates items and redirects past it.
  // It declares antragId so pruning keeps the link between Vortrag and Antrag.
  vortragZuordnung: {
    stepId: "/tatsachenvortrag-beweise/vortraege/#/zuordnung",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "vortraege#antragId": hiddenInputSchema(
        vortraegeArraySchema.element.shape.antragId,
      ),
    },
  },
  absaetzeUebersicht: {
    stepId: "/tatsachenvortrag-beweise/vortraege/#/absaetze",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "vortraege#absaetze",
      schema: absaetzeArraySchema,
      isArrayRelevant: () => true,
    },
  },
  absatzDaten: {
    stepId: "/tatsachenvortrag-beweise/vortraege/#/absaetze/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "vortraege#absaetze#formulierung": stringRequiredMaxSchema({
        max: 10000,
      }),
    },
  },
  augenscheinDaten: {
    stepId:
      "/tatsachenvortrag-beweise/vortraege/#/absaetze/#/beweise/#/augenschein-daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "vortraege#absaetze#beweise#beschreibung":
        augenscheinSchema.shape.beschreibung,
      "vortraege#absaetze#beweise#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(augenscheinSchema.shape.id),
      ),
      "vortraege#absaetze#beweise#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(beweismittelSchema.shape.type),
      ),
    },
  },
  urkundeDaten: {
    stepId:
      "/tatsachenvortrag-beweise/vortraege/#/absaetze/#/beweise/#/urkunde-daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "vortraege#absaetze#beweise#beschreibung":
        urkundeSchema.shape.beschreibung,
      "vortraege#absaetze#beweise#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(urkundeSchema.shape.id),
      ),
      "vortraege#absaetze#beweise#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(beweismittelSchema.shape.type),
      ),
    },
  },
  sachverstaendigengutachtenDaten: {
    stepId:
      "/tatsachenvortrag-beweise/vortraege/#/absaetze/#/beweise/#/sachverstaendigengutachten-daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "vortraege#absaetze#beweise#beschreibung":
        sachverstaendigengutachtenSchema.shape.beschreibung,
      "vortraege#absaetze#beweise#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(sachverstaendigengutachtenSchema.shape.id),
      ),
      "vortraege#absaetze#beweise#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(beweismittelSchema.shape.type),
      ),
    },
  },
  zeugeDaten: {
    stepId:
      "/tatsachenvortrag-beweise/vortraege/#/absaetze/#/beweise/#/zeuge-daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "vortraege#absaetze#beweise#anrede": zeugeSchema.shape.anrede,
      "vortraege#absaetze#beweise#titel": zeugeSchema.shape.titel,
      "vortraege#absaetze#beweise#vorname": zeugeSchema.shape.vorname,
      "vortraege#absaetze#beweise#nachname": zeugeSchema.shape.nachname,
      "vortraege#absaetze#beweise#strasse": zeugeSchema.shape.strasse,
      "vortraege#absaetze#beweise#hausnummer": zeugeSchema.shape.hausnummer,
      "vortraege#absaetze#beweise#plz": zeugeSchema.shape.plz,
      "vortraege#absaetze#beweise#ort": zeugeSchema.shape.ort,
      "vortraege#absaetze#beweise#land": zeugeSchema.shape.land,
      "vortraege#absaetze#beweise#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(zeugeSchema.shape.id),
      ),
      "vortraege#absaetze#beweise#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(beweismittelSchema.shape.type),
      ),
    },
  },
  parteivernehmungDaten: {
    stepId:
      "/tatsachenvortrag-beweise/vortraege/#/absaetze/#/beweise/#/parteivernehmung-daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "vortraege#absaetze#beweise#personen":
        parteivernehmungSchema.shape.personen,
      "vortraege#absaetze#beweise#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(parteivernehmungSchema.shape.id),
      ),
      "vortraege#absaetze#beweise#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(beweismittelSchema.shape.type),
      ),
    },
  },
} as const satisfies PageConfigMap;
