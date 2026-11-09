import { z } from "zod";
import {
  annahmeverzugSchema,
  hauptantraegeArraySchema,
  nebenantragSchema,
} from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
import type { PagesConfig } from "~/domains/pageSchemas";
import { hiddenInputSchema } from "~/services/validation/hiddenInput";
import { schemaOrEmptyStringOptional } from "~/services/validation/schemaOrEmptyString";

export const hauptUndNebenantraegePages = {
  hauptantragUebersicht: {
    stepId:
      "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/uebersicht",
    arraySummary: {
      name: "hauptantrag",
      schema: hauptantraegeArraySchema,
      isArrayRelevant: () => true,
    },
  },
  hauptantragDaten: {
    stepId:
      "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/hauptantrag/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#internesSchlagwortFordureung":
        hauptantraegeArraySchema.element.shape.internesSchlagwortFordureung,
      "hauptantrag#betragForderung":
        hauptantraegeArraySchema.element.shape.betragForderung,
      "hauptantrag#beklagte": hauptantraegeArraySchema.element.shape.beklagte,
      "hauptantrag#klagende": hauptantraegeArraySchema.element.shape.klagende,
      "hauptantrag#zugUndZug": hauptantraegeArraySchema.element.shape.zugUndZug,
      "hauptantrag#beschreibungDerGegenleistung":
        hauptantraegeArraySchema.element.shape.beschreibungDerGegenleistung,
      "hauptantrag#zinssatzInProzent":
        hauptantraegeArraySchema.element.shape.zinssatzInProzent,
      "hauptantrag#zinsmethode":
        hauptantraegeArraySchema.element.shape.zinsmethode,
      "hauptantrag#zinsbeginn":
        hauptantraegeArraySchema.element.shape.zinsbeginn,
      "hauptantrag#zinsende": hauptantraegeArraySchema.element.shape.zinsende,
    },
  },
  hauptantragWarnung: {
    stepId:
      "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  nebenantragDaten: {
    stepId:
      "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/#/nebenantrag/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#nebenantraege#nebenantragArt":
        nebenantragSchema.shape.nebenantragArt,
      "hauptantrag#nebenantraege#nebenantragBetrag":
        nebenantragSchema.shape.nebenantragBetrag,
      "hauptantrag#nebenantraege#nebenantragZinssatzInProzent":
        nebenantragSchema.shape.nebenantragZinssatzInProzent,
      "hauptantrag#nebenantraege#nebenantragZinsmethode":
        nebenantragSchema.shape.nebenantragZinsmethode,
      "hauptantrag#nebenantraege#nebenantragZinsbeginn":
        nebenantragSchema.shape.nebenantragZinsbeginn,
      "hauptantrag#nebenantraege#nebenantragZinsende":
        nebenantragSchema.shape.nebenantragZinsende,
      "hauptantrag#nebenantraege#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(z.string()),
      ),
    },
  },
  annahmeverzugDaten: {
    stepId:
      "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/#/annahmeverzug/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#nebenantraege#annahmeverzugsFeststellung":
        annahmeverzugSchema.shape.annahmeverzugsFeststellung,
      "hauptantrag#nebenantraege#annahmeverzugDatum":
        annahmeverzugSchema.shape.annahmeverzugDatum,
      "hauptantrag#nebenantraege#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(z.string()),
      ),
    },
  },
} as const satisfies PagesConfig;
