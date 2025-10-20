import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { createDateSchema } from "~/services/validation/date";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

const MINUS_150_YEARS = -150;

const familyRelationship = [
  "mother",
  "father",
  "grandmother",
  "grandfather",
  "kid",
  "grandchild",
  "ex-spouse",
  "ex-partner",
] as const;

const unterhaltszahlungenArraySchema = z
  .object({
    familyRelationship: z.enum(familyRelationship),
    firstName: stringRequiredSchema,
    surname: stringRequiredSchema,
    birthday: createDateSchema({
      earliest: () => addYears(today(), MINUS_150_YEARS),
      latest: () => today(),
    }),
    monthlyPayment: buildMoneyValidationSchema(),
  })
  .array()
  .min(1);

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
      unterhaltszahlungen: unterhaltszahlungenArraySchema,
    },
    arrayPages: {
      daten: {
        pageSchema: {
          "unterhaltszahlungen#firstName":
            unterhaltszahlungenArraySchema.element.shape.firstName,
          "unterhaltszahlungen#surname":
            unterhaltszahlungenArraySchema.element.shape.surname,
          "unterhaltszahlungen#familyRelationship":
            unterhaltszahlungenArraySchema.element.shape.familyRelationship,
          "unterhaltszahlungen#birthday":
            unterhaltszahlungenArraySchema.element.shape.birthday,
          "unterhaltszahlungen#monthlyPayment":
            unterhaltszahlungenArraySchema.element.shape.monthlyPayment,
        },
      },
    },
  },
} as const satisfies PagesConfig;
