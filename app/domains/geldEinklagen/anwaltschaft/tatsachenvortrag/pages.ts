import { hauptantraegeArraySchema } from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
import {
  absaetzeArraySchema,
  augenscheinSchema,
  beweismittelSchema,
  sachverstaendigengutachtenSchema,
  urkundeSchema,
} from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";
import { hiddenInputSchema } from "~/services/validation/hiddenInput";
import { schemaOrEmptyStringOptional } from "~/services/validation/schemaOrEmptyString";
import { stringRequiredMaxSchema } from "~/services/validation/stringRequired";

export const tatsachenvortragPages = {
  antraegeUebersicht: {
    stepId: "/tatsachenvortrag-beweise/uebersicht",
    arraySummary: {
      name: "hauptantrag",
      schema: hauptantraegeArraySchema,
      isArrayRelevant: () => true,
    },
  },
  absaetzeUebersicht: {
    stepId: "/tatsachenvortrag-beweise/hauptantrag/#/absaetze",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "hauptantrag#absaetze",
      schema: absaetzeArraySchema,
      isArrayRelevant: () => true,
    },
  },
  absatzDaten: {
    stepId: "/tatsachenvortrag-beweise/hauptantrag/#/absaetze/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#absaetze#formulierung": stringRequiredMaxSchema({
        max: 10000,
      }),
    },
  },
  nebenantragAbsatzUebersicht: {
    stepId: "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "hauptantrag#nebenantraege#absaetze",
      schema: absaetzeArraySchema,
      isArrayRelevant: () => true,
    },
  },
  nebenantragAbsatzDaten: {
    stepId:
      "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#nebenantraege#absaetze#formulierung":
        stringRequiredMaxSchema({
          max: 10000,
        }),
    },
  },
  augenscheinDaten: {
    stepId:
      "/tatsachenvortrag-beweise/hauptantrag/#/absaetze/#/beweise/#/augenschein-daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#absaetze#beweise#beschreibung":
        augenscheinSchema.shape.beschreibung,
      "hauptantrag#absaetze#beweise#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(augenscheinSchema.shape.id),
      ),
      "hauptantrag#absaetze#beweise#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(beweismittelSchema.shape.type),
      ),
    },
  },
  nebenantragAugenscheinDaten: {
    stepId:
      "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze/#/beweise/#/augenschein-daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#nebenantraege#absaetze#beweise#beschreibung":
        augenscheinSchema.shape.beschreibung,
      "hauptantrag#nebenantraege#absaetze#beweise#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(augenscheinSchema.shape.id),
      ),
      "hauptantrag#nebenantraege#absaetze#beweise#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(beweismittelSchema.shape.type),
      ),
    },
  },
  urkundeDaten: {
    stepId:
      "/tatsachenvortrag-beweise/hauptantrag/#/absaetze/#/beweise/#/urkunde-daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#absaetze#beweise#beschreibung":
        urkundeSchema.shape.beschreibung,
      "hauptantrag#absaetze#beweise#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(urkundeSchema.shape.id),
      ),
      "hauptantrag#absaetze#beweise#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(beweismittelSchema.shape.type),
      ),
    },
  },
  nebenantragUrkundeDaten: {
    stepId:
      "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze/#/beweise/#/urkunde-daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#nebenantraege#absaetze#beweise#beschreibung":
        urkundeSchema.shape.beschreibung,
      "hauptantrag#nebenantraege#absaetze#beweise#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(urkundeSchema.shape.id),
      ),
      "hauptantrag#nebenantraege#absaetze#beweise#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(beweismittelSchema.shape.type),
      ),
    },
  },
  sachverstaendigengutachtenDaten: {
    stepId:
      "/tatsachenvortrag-beweise/hauptantrag/#/absaetze/#/beweise/#/sachverstaendigengutachten-daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#absaetze#beweise#beschreibung":
        sachverstaendigengutachtenSchema.shape.beschreibung,
      "hauptantrag#absaetze#beweise#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(sachverstaendigengutachtenSchema.shape.id),
      ),
      "hauptantrag#absaetze#beweise#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(beweismittelSchema.shape.type),
      ),
    },
  },
  nebenantragSachverstaendigengutachtenDaten: {
    stepId:
      "/tatsachenvortrag-beweise/hauptantrag/#/nebenantraege/#/absaetze/#/beweise/#/sachverstaendigengutachten-daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#nebenantraege#absaetze#beweise#beschreibung":
        sachverstaendigengutachtenSchema.shape.beschreibung,
      "hauptantrag#nebenantraege#absaetze#beweise#id": hiddenInputSchema(
        schemaOrEmptyStringOptional(sachverstaendigengutachtenSchema.shape.id),
      ),
      "hauptantrag#nebenantraege#absaetze#beweise#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(beweismittelSchema.shape.type),
      ),
    },
  },
} as const satisfies PageConfigMap;
