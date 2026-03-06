import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import {
  createSplitDateSchema,
  MINUS_150_YEARS,
} from "~/services/validation/date";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

const unterhaltszahlungenArraySchema = z
  .object({
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
    birthday: createSplitDateSchema({
      earliest: () => addYears(today(), MINUS_150_YEARS),
      latest: () => today(),
    }),
    monthlyPayment: buildMoneyValidationSchema(),
  })
  .array()
  .min(1);

export const berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages = {
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
      unterhaltszahlungen: unterhaltszahlungenArraySchema,
    },
    arrayPages: {
      daten: {
        pageSchema: {
          "unterhaltszahlungen#familyRelationship":
            unterhaltszahlungenArraySchema.element.shape.familyRelationship,
          "unterhaltszahlungen#firstName":
            unterhaltszahlungenArraySchema.element.shape.firstName,
          "unterhaltszahlungen#surname":
            unterhaltszahlungenArraySchema.element.shape.surname,
          "unterhaltszahlungen#birthday":
            unterhaltszahlungenArraySchema.element.shape.birthday,
          "unterhaltszahlungen#monthlyPayment":
            unterhaltszahlungenArraySchema.element.shape.monthlyPayment,
        },
      },
    },
  },
} as const satisfies PagesConfig;
