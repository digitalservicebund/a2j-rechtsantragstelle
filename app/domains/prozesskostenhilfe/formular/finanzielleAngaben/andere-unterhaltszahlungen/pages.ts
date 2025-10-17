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

const sharedAndereUnterhaltszahlungenFields = {
  familyRelationship: z.enum(familyRelationship),
  firstName: stringRequiredSchema,
  surname: stringRequiredSchema,
  birthday: createDateSchema({
    earliest: () => addYears(today(), MINUS_150_YEARS),
    latest: () => today(),
  }),
  monthlyPayment: buildMoneyValidationSchema(),
};
const unterhaltszahlungenArraySchema = z
  .union([
    z.object({
      ...sharedAndereUnterhaltszahlungenFields,
      familyRelationship: z.literal("mother"),
    }),
    z.object({
      ...sharedAndereUnterhaltszahlungenFields,
      familyRelationship: z.literal("father"),
    }),
    z.object({
      ...sharedAndereUnterhaltszahlungenFields,
      familyRelationship: z.literal("grandmother"),
    }),
    z.object({
      ...sharedAndereUnterhaltszahlungenFields,
      familyRelationship: z.literal("grandfather"),
    }),
    z.object({
      ...sharedAndereUnterhaltszahlungenFields,
      familyRelationship: z.literal("kid"),
    }),
    z.object({
      ...sharedAndereUnterhaltszahlungenFields,
      familyRelationship: z.literal("grandchild"),
    }),
    z.object({
      ...sharedAndereUnterhaltszahlungenFields,
      familyRelationship: z.literal("ex-spouse"),
    }),
    z.object({
      ...sharedAndereUnterhaltszahlungenFields,
      familyRelationship: z.literal("ex-partner"),
    }),
  ])
  .array();

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
            sharedAndereUnterhaltszahlungenFields.firstName,
          "unterhaltszahlungen#surname":
            sharedAndereUnterhaltszahlungenFields.surname,
          "unterhaltszahlungen#familyRelationship":
            sharedAndereUnterhaltszahlungenFields.familyRelationship,
          "unterhaltszahlungen#birthday":
            sharedAndereUnterhaltszahlungenFields.birthday,
          "unterhaltszahlungen#monthlyPayment":
            sharedAndereUnterhaltszahlungenFields.monthlyPayment,
        },
      },
    },
  },
} as const satisfies PagesConfig;
