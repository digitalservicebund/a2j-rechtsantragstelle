import { z } from "zod";
import {
  annahmeverzugSchema,
  antragIdSchema,
  hauptantraegeArraySchema,
  nebenantragSchema,
  schmerzengeldantragSchema,
  schmerzengeldNebenantragSchema,
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
      "hauptantrag#internesSchlagwortForderung":
        hauptantraegeArraySchema.element.shape.internesSchlagwortForderung,
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
      "hauptantrag#id": hiddenInputSchema(antragIdSchema),
    },
  },
  hauptantragWarnung: {
    stepId:
      "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  nebenantragDaten: {
    stepId:
      "/haupt-und-nebenantraege/bezifferte-zahlungs-und-nebenantraege/#/nebenantraege/#/daten",
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
      "hauptantrag#nebenantraege#id": hiddenInputSchema(antragIdSchema),
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
      "hauptantrag#nebenantraege#id": hiddenInputSchema(antragIdSchema),
      "hauptantrag#nebenantraege#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(z.string()),
      ),
    },
  },
  schmerzengeldantraegeUebersicht: {
    stepId:
      "/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/uebersicht",
    arraySummary: {
      name: "schmerzengeldantrag",
      schema: schmerzengeldantragSchema,
      isArrayRelevant: () => true,
    },
  },
  schmerzengeldantragDaten: {
    stepId:
      "/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/schmerzensgeldantraege/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "schmerzengeldantrag#internesSchlagwortForderung":
        schmerzengeldantragSchema.element.shape.internesSchlagwortForderung,
      "schmerzengeldantrag#mindestBetrag":
        schmerzengeldantragSchema.element.shape.mindestBetrag,
      "schmerzengeldantrag#beklagte":
        schmerzengeldantragSchema.element.shape.beklagte,
      "schmerzengeldantrag#klagende":
        schmerzengeldantragSchema.element.shape.klagende,
      "schmerzengeldantrag#zinsmethode":
        schmerzengeldantragSchema.element.shape.zinsmethode,
      "schmerzengeldantrag#zinssatzInProzent":
        schmerzengeldantragSchema.element.shape.zinssatzInProzent,
      "schmerzengeldantrag#zinsbeginn":
        schmerzengeldantragSchema.element.shape.zinsbeginn,
      "schmerzengeldantrag#zinsende":
        schmerzengeldantragSchema.element.shape.zinsende,
      "schmerzengeldantrag#id": hiddenInputSchema(antragIdSchema),
      "schmerzengeldantrag#type": hiddenInputSchema(
        schemaOrEmptyStringOptional(z.string()),
      ),
    },
  },
  schmerzengeldNebenantragDaten: {
    stepId:
      "/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/#/nebenantraege/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragArt":
        schmerzengeldNebenantragSchema.shape.schmerzengeldNebenantragArt,
      "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragBetrag":
        schmerzengeldNebenantragSchema.shape.schmerzengeldNebenantragBetrag,
      "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragZinsmethode":
        schmerzengeldNebenantragSchema.shape
          .schmerzengeldNebenantragZinsmethode,
      "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragZinssatzInProzent":
        schmerzengeldNebenantragSchema.shape
          .schmerzengeldNebenantragZinssatzInProzent,
      "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragZinsbeginn":
        schmerzengeldNebenantragSchema.shape.schmerzengeldNebenantragZinsbeginn,
      "schmerzengeldantrag#nebenantraege#schmerzengeldNebenantragZinsende":
        schmerzengeldNebenantragSchema.shape.schmerzengeldNebenantragZinsende,
      "schmerzengeldantrag#nebenantraege#id": hiddenInputSchema(antragIdSchema),
    },
  },
  schmerzengeldantragWarnung: {
    stepId:
      "/haupt-und-nebenantraege/unbezifferte-schmerzensgeld-und-nebenantraege/schmerzensgeldantraege/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
} as const satisfies PagesConfig;
