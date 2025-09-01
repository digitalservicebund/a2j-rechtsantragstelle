import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { createDateSchema } from "~/services/validation/date";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

const MINUS_150_YEARS = -150;

export const pkhFormularFinanzielleAngabenAndereUnterhaltszahlungenPages = {
  andereUnterhaltszahlungenFrage: {
    stepId: "finanzielle-angaben/andere-unterhaltszahlungen/frage",
    pageSchema: {
      hasWeitereUnterhaltszahlungen: YesNoAnswer,
    },
  },
  andereUnterhaltszahlungenUebersicht: {
    stepId: "finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
  },
  andereUnterhaltszahlungenWarnung: {
    stepId: "finanzielle-angaben/andere-unterhaltszahlungen/warnung",
  },
  andereUnterhaltszahlungenPerson: {
    stepId: "finanzielle-angaben/andere-unterhaltszahlungen/person",
    pageSchema: {
      unterhaltszahlungen: z.array(
        z.object({
          familyRelationship: z.enum([
            "mother",
            "father",
            "grandmother",
            "grandfather",
            "kid",
            "ex-spouse",
            "ex-partner",
            "grandchild",
          ]),
          firstName: stringRequiredSchema,
          surname: stringRequiredSchema,
          birthday: createDateSchema({
            earliest: () => addYears(today(), MINUS_150_YEARS),
            latest: () => today(),
          }),
          monthlyPayment: buildMoneyValidationSchema(),
        }),
      ),
    },
    arrayPages: {
      daten: {
        pageSchema: {
          "unterhaltszahlungen#firstName": stringRequiredSchema,
          "unterhaltszahlungen#surname": stringRequiredSchema,
          "unterhaltszahlungen#familyRelationship": z.enum([
            "mother",
            "father",
            "grandmother",
            "grandfather",
            "kid",
          ]),
          "unterhaltszahlungen#birthday": createDateSchema({
            earliest: () => addYears(today(), -150),
            latest: () => today(),
          }),
          "unterhaltszahlungen#monthlyPayment": buildMoneyValidationSchema(),
        },
      },
    },
  },
} as const satisfies PagesConfig;
