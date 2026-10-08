import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";

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
        min: 0,
        max: 10000,
      }),
    },
  },
  //   downloadKlageschrift: {
  //     stepId: "/klageschrift-herunterladen",
  //   },
} as const satisfies PagesConfig;

export type GeldEinklagenAnwaltschaftPages =
  typeof geldEinklagenAnwaltschaftPages;
