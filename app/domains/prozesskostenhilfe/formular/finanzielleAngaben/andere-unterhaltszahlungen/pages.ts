import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { unterhaltszahlungInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

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
      unterhaltszahlungen: z.array(unterhaltszahlungInputSchema),
    },
    arrayPages: {
      daten: {
        pageSchema: {
          "unterhaltszahlungen#firstName":
            unterhaltszahlungInputSchema.shape.firstName,
          "unterhaltszahlungen#surname":
            unterhaltszahlungInputSchema.shape.surname,
          "unterhaltszahlungen#familyRelationship":
            unterhaltszahlungInputSchema.shape.familyRelationship,
          "unterhaltszahlungen#birthday":
            unterhaltszahlungInputSchema.shape.birthday,
          "unterhaltszahlungen#monthlyPayment":
            unterhaltszahlungInputSchema.shape.monthlyPayment,
        },
      },
    },
  },
} as const satisfies PagesConfig;
