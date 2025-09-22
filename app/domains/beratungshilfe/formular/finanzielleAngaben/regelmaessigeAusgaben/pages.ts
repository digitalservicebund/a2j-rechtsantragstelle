import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { besondereBelastungenInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { createDateSchema } from "~/services/validation/date";
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
const zahlungsfristSchema = createDateSchema({ earliest: () => today() });

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
  ausgabenSituation: {
    stepId: "finanzielle-angaben/ausgaben/situation",
    pageSchema: {
      ausgabensituation: besondereBelastungenInputSchema,
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
} as const satisfies PagesConfig;
