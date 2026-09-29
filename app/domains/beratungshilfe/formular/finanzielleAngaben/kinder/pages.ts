import z from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { childBirthdaySchema } from "~/services/validation/dateString";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const sharedKinderFields = {
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
  geburtsdatum: childBirthdaySchema,
  wohnortBeiAntragsteller: z.enum(["yes", "no", "partially"]),
};

export const kinderArraySchema = z
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

export const berhAntragFinanzielleAngabenKinderPages = {
  kinderFrage: {
    stepId: "finanzielle-angaben/kinder/kinder-frage",
    pageSchema: { hasKinder: YesNoAnswer },
  },
  kinderUebersicht: {
    stepId: "finanzielle-angaben/kinder/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "kinder",
      schema: kinderArraySchema,
      fieldName: "hasKinder",
      hiddenFields: ["eigeneEinnahmen", "unterhalt"],
    },
  },
  kinderWarnung: {
    stepId: "finanzielle-angaben/kinder/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  kinderName: {
    stepId: "finanzielle-angaben/kinder/kinder/#/name",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#vorname": sharedKinderFields.vorname,
      "kinder#nachname": sharedKinderFields.nachname,
      "kinder#geburtsdatum": sharedKinderFields.geburtsdatum,
    },
  },
  kinderWohnort: {
    stepId: "finanzielle-angaben/kinder/kinder/#/wohnort",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#wohnortBeiAntragsteller":
        sharedKinderFields.wohnortBeiAntragsteller,
    },
  },
  kinderEigeneEinnahmenFrage: {
    stepId: "finanzielle-angaben/kinder/kinder/#/kind-eigene-einnahmen-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#eigeneEinnahmen": YesNoAnswer,
    },
  },
  kinderEigeneEinnahmen: {
    stepId: "finanzielle-angaben/kinder/kinder/#/kind-eigene-einnahmen",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#einnahmen": buildMoneyValidationSchema(),
    },
  },
  kinderUnterhaltFrage: {
    stepId: "finanzielle-angaben/kinder/kinder/#/kind-unterhalt-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#unterhalt": YesNoAnswer,
    },
  },
  kinderUnterhalt: {
    stepId: "finanzielle-angaben/kinder/kinder/#/kind-unterhalt",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#unterhaltsSumme": buildMoneyValidationSchema(),
    },
  },
  kinderUnterhaltEnde: {
    stepId: "finanzielle-angaben/kinder/kinder/#/kind-unterhalt-ende",
    shouldCollapseIntoParentNavItem: true,
  },
} as const satisfies PagesConfig;
