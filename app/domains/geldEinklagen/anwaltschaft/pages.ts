import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import {
  buildMoneyValidationSchema,
  formatCurrencyZodDescription,
} from "~/services/validation/money/buildMoneyValidationSchema";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";

export const geldEinklagenAnwaltschaftPages = {
  voraussetzungen: {
    stepId: "/voraussetzungen/intro",
  },
  klageInhalt: {
    stepId: "/inhalt-klage",
    pageSchema: {
      zahlungsklageSubjectLine: z
        .string()
        .trim()
        .max(100, { message: "max" })
        .optional(),
      zahlungsklageBezeichnung: z
        .string()
        .trim()
        .max(100, { message: "max" })
        .optional(),
      zahlungsklageNummer: z
        .string()
        .trim()
        .max(50, { message: "max" })
        .optional(),
      zahlungsklageGesamtstreitwert: buildMoneyValidationSchema({
        min: 1,
        max: 1000000,
      }).meta({ description: formatCurrencyZodDescription }),
    },
  },
  pilotgericht: {
    stepId: "/pilotgericht",
    pageSchema: {
      pilotgericht: z.enum([
        "bitburg",
        "bonn",
        "bremen",
        "duesseldorf",
        "eilenburg",
        "erding",
        "essen",
        "frankfurt-am-main",
        "hamburg-mitte",
        "koenigs-wusterhausen",
        "leipzig",
        "mannheim",
        "nuernberg",
        "nuertingen",
        "schoeneberg",
        "sinzig",
        "steinfurt",
      ]),
    },
  },
  rechtlicheWuerdigung: {
    stepId: "/rechtliche-wuerdigung",
    pageSchema: {
      rechtlicheWuerdigung: schemaOrEmptyString(
        z.string().trim().max(60000, { message: "max" }),
      ),
    },
  },
  //   downloadKlageschrift: {
  //     stepId: "/klageschrift-herunterladen",
  //   },
} as const satisfies PagesConfig;

export type GeldEinklagenAnwaltschaftPages =
  typeof geldEinklagenAnwaltschaftPages;
