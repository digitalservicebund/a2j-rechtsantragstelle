import {
  klageParteinArraySchema,
  naturalPersonSchema,
} from "~/domains/geldEinklagen/anwaltschaft/shared/anwaltschaftSchemas";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { hiddenInputSchema } from "~/services/validation/hiddenInput";

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
      "klagenden#index": hiddenInputSchema(naturalPersonSchema.shape.index),
      "klagenden#type": hiddenInputSchema(naturalPersonSchema.shape.type),
    },
  },
  klagendeOrganizationDaten: {
    stepId: "/klagende-partei/klagenden/#/organisation-daten",
  },
} as const satisfies PageConfigMap;
