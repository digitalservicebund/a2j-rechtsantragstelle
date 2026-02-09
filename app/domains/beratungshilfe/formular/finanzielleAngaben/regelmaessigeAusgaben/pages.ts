import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { besondereBelastungenInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { createSplitDateSchema } from "~/services/validation/date";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { today } from "~/util/date";

const sharedAusgabenFields = {
  art: stringRequiredSchema,
  zahlungsempfaenger: stringRequiredSchema,
  beitrag: buildMoneyValidationSchema(),
  hasZahlungsfrist: YesNoAnswer,
};

// For Zahlungsfrist we allow future dates (deadlines), so we can't use the
// generic birthdate-oriented split date schema which forbids years after today.
// This custom schema keeps the same split-date shape but only enforces basic
// numeric ranges plus "not before today".
const zahlungsfristSchema = z
  .object({
    day: z
      .string()
      .trim()
      .min(1)
      .refine((val) => {
        const num = Number(val);
        return !Number.isNaN(num) && num >= 1 && num <= 31;
      }),
    month: z
      .string()
      .trim()
      .min(1)
      .refine((val) => {
        const num = Number(val);
        return !Number.isNaN(num) && num >= 1 && num <= 12;
      }),
    year: z
      .string()
      .trim()
      .min(1)
      .refine((val) => {
        const num = Number(val);
        return !Number.isNaN(num) && num >= 1900;
      }),
  })
  .superRefine((data, ctx) => {
    const date = new Date(
      Number(data.year),
      Number(data.month) - 1,
      Number(data.day),
    );
    const todayDate = today();
    // Normalize both to midnight UTC to avoid timezone edge cases
    const normalizedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const normalizedToday = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      todayDate.getDate(),
    );

    if (normalizedDate < normalizedToday) {
      ctx.addIssue({
        code: "custom",
        message: "too_early",
        path: ["year"],
      });
    }
  })
  .meta({ description: "split_date" });

export const ausgabenArraySchema = z
  .union([
    z.object({
      ...sharedAusgabenFields,
      hasZahlungsfrist: z.literal("no"),
    }),
    z.object({
      ...sharedAusgabenFields,
      hasZahlungsfrist: z.literal("yes"),
      zahlungsfrist: zahlungsfristSchema,
    }),
  ])
  .array()
  .min(1);

export const berhAntragFinanzielleAngabenRegelmassigeAusgabenPages = {
  ausgaben: {
    stepId: "finanzielle-angaben/ausgaben",
  },
  ausgabenFrage: {
    stepId: "finanzielle-angaben/ausgaben/ausgaben-frage",
    pageSchema: {
      hasAusgaben: YesNoAnswer,
    },
  },
  ausgabenUebersicht: {
    stepId: "finanzielle-angaben/ausgaben/uebersicht",
  },
  ausgabenAusgaben: {
    stepId: "finanzielle-angaben/ausgaben/ausgaben",
    pageSchema: { ausgaben: ausgabenArraySchema },
    arrayPages: {
      art: {
        pageSchema: {
          "ausgaben#art": sharedAusgabenFields.art,
          "ausgaben#zahlungsempfaenger":
            sharedAusgabenFields.zahlungsempfaenger,
        },
      },
      zahlungsinformation: {
        pageSchema: { "ausgaben#beitrag": sharedAusgabenFields.beitrag },
      },
      laufzeit: {
        pageSchema: {
          "ausgaben#hasZahlungsfrist": sharedAusgabenFields.hasZahlungsfrist,
        },
      },
      zahlungsfrist: {
        pageSchema: { "ausgaben#zahlungsfrist": zahlungsfristSchema },
      },
    },
  },
  ausgabenWarnung: {
    stepId: "finanzielle-angaben/ausgaben/warnung",
  },
  ausgabenSituation: {
    stepId: "finanzielle-angaben/ausgaben/situation",
    pageSchema: {
      ausgabensituation: besondereBelastungenInputSchema,
    },
  },
} as const satisfies PagesConfig;
