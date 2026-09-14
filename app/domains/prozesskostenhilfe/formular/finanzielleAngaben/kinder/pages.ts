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
    stepId: "/finanzielle-angaben/kinder/kinder-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: { hasKinder: YesNoAnswer },
  },
  kinderUebersicht: {
    stepId: "/finanzielle-angaben/kinder/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "kinder",
      schema: kinderArraySchema,
    },
  },
  kinderWarnung: {
    stepId: "/finanzielle-angaben/kinder/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  kinder: {
    stepId: "/finanzielle-angaben/kinder/kinder/#/daten",
    shouldCollapseIntoParentNavItem: true,
  },
  name: {
    stepId: "/finanzielle-angaben/kinder/kinder/#/name",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#vorname": sharedKinderFields.vorname,
      "kinder#nachname": sharedKinderFields.nachname,
      "kinder#geburtsdatum": sharedKinderFields.geburtsdatum,
    },
  },
  wohnort: {
    stepId: "/finanzielle-angaben/kinder/kinder/#/wohnort",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#wohnortBeiAntragsteller":
        sharedKinderFields.wohnortBeiAntragsteller,
    },
  },
  "kind-eigene-einnahmen-frage": {
    stepId: "/finanzielle-angaben/kinder/kinder/#/kind-eigene-einnahmen-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#eigeneEinnahmen": YesNoAnswer,
    },
  },
  "kind-eigene-einnahmen": {
    stepId: "/finanzielle-angaben/kinder/kinder/#/kind-eigene-einnahmen",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#einnahmen": buildMoneyValidationSchema(),
    },
  },
  "kind-unterhalt-frage": {
    stepId: "/finanzielle-angaben/kinder/kinder/#/kind-unterhalt-frage",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#unterhalt": YesNoAnswer,
    },
  },
  "kind-unterhalt": {
    stepId: "/finanzielle-angaben/kinder/kinder/#/kind-unterhalt",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "kinder#unterhaltsSumme": buildMoneyValidationSchema(),
    },
  },
  "kind-unterhalt-ende": {
    stepId: "/finanzielle-angaben/kinder/kinder/#/kind-unterhalt-ende",
    shouldCollapseIntoParentNavItem: true,
  },
} as const satisfies PagesConfig;
