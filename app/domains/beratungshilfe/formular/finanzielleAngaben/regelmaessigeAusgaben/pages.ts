import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { besondereBelastungenInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { createDateSchema } from "~/services/validation/dateString";
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
  ausgabenFrage: {
    stepId: "finanzielle-angaben/ausgaben/ausgaben-frage",
    pageSchema: {
      hasAusgaben: YesNoAnswer,
    },
  },
  ausgabenUebersicht: {
    stepId: "finanzielle-angaben/ausgaben/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "ausgaben",
      schema: ausgabenArraySchema,
      fieldName: "hasAusgaben",
      hiddenFields: ["hasZahlungsfrist"],
    },
  },
  ausgabenArt: {
    stepId: "finanzielle-angaben/ausgaben/ausgaben/#/art",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "ausgaben#art": sharedAusgabenFields.art,
      "ausgaben#zahlungsempfaenger": sharedAusgabenFields.zahlungsempfaenger,
    },
  },
  ausgabenZahlungsinformation: {
    stepId: "finanzielle-angaben/ausgaben/ausgaben/#/zahlungsinformation",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: { "ausgaben#beitrag": sharedAusgabenFields.beitrag },
  },
  ausgabenLaufzeit: {
    stepId: "finanzielle-angaben/ausgaben/ausgaben/#/laufzeit",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "ausgaben#hasZahlungsfrist": sharedAusgabenFields.hasZahlungsfrist,
    },
  },
  ausgabenZahlungsfrist: {
    stepId: "finanzielle-angaben/ausgaben/ausgaben/#/zahlungsfrist",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: { "ausgaben#zahlungsfrist": zahlungsfristSchema },
  },
  ausgabenWarnung: {
    stepId: "finanzielle-angaben/ausgaben/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  ausgabenSituation: {
    stepId: "finanzielle-angaben/ausgaben/situation",
    pageSchema: {
      ausgabensituation: besondereBelastungenInputSchema,
    },
  },
} as const satisfies PagesConfig;
