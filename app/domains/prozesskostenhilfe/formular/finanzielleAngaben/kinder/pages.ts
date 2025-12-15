import z from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { childBirthdaySchema } from "~/services/validation/date";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const sharedKinderFields = {
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
  geburtsdatum: childBirthdaySchema,
  wohnortBeiAntragsteller: z.enum(["yes", "no", "partially"]),
};

const kinderArraySchema = z
  .union([
    z.object({
      ...sharedKinderFields,
      wohnortBeiAntragsteller: z.enum(["yes", "partially"]),
      eigeneEinnahmen: z.literal("no"),
    }),
    z.object({
      ...sharedKinderFields,
      wohnortBeiAntragsteller: z.enum(["yes", "partially"]),
      eigeneEinnahmen: z.literal("yes"),
      einnahmen: buildMoneyValidationSchema(),
    }),
    z.object({
      ...sharedKinderFields,
      wohnortBeiAntragsteller: z.literal("no"),
      unterhalt: z.literal("no"),
    }),
    z.object({
      ...sharedKinderFields,
      wohnortBeiAntragsteller: z.literal("no"),
      unterhalt: z.literal("yes"),
      unterhaltsSumme: buildMoneyValidationSchema(),
    }),
  ])
  .array()
  .min(1);

export type KinderArraySchema = z.infer<typeof kinderArraySchema>[number];

export const pkhFormularFinanzielleAngabenKinderPages = {
  kinderFrage: {
    stepId: "finanzielle-angaben/kinder/kinder-frage",
    pageSchema: { hasKinder: YesNoAnswer },
  },
  kinderUebersicht: {
    stepId: "finanzielle-angaben/kinder/uebersicht",
  },
  kinderWarnung: {
    stepId: "finanzielle-angaben/kinder/warnung",
  },
  kinder: {
    stepId: "finanzielle-angaben/kinder/kinder",
    pageSchema: { kinder: kinderArraySchema },
    arrayPages: {
      name: {
        pageSchema: {
          "kinder#vorname": sharedKinderFields.vorname,
          "kinder#nachname": sharedKinderFields.nachname,
          "kinder#geburtsdatum": sharedKinderFields.geburtsdatum,
        },
      },
      wohnort: {
        pageSchema: {
          "kinder#wohnortBeiAntragsteller":
            sharedKinderFields.wohnortBeiAntragsteller,
        },
      },
      "kind-eigene-einnahmen-frage": {
        pageSchema: {
          "kinder#eigeneEinnahmen": YesNoAnswer,
        },
      },
      "kind-eigene-einnahmen": {
        pageSchema: {
          "kinder#einnahmen": buildMoneyValidationSchema(),
        },
      },
      "kind-unterhalt-frage": {
        pageSchema: {
          "kinder#unterhalt": YesNoAnswer,
        },
      },
      "kind-unterhalt": {
        pageSchema: {
          "kinder#unterhaltsSumme": buildMoneyValidationSchema(),
        },
      },
      "kind-unterhalt-ende": {},
    },
  },
} as const satisfies PagesConfig;
