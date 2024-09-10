import { z } from "zod";
import {
  besondereBelastungenSchema,
  bankkontenArraySchema,
  gelanlagenArraySchema,
  grundeigentumArraySchema,
  kinderArraySchema,
  kraftfahrzeugeArraySchema,
  staatlicheLeistungen,
  unterhaltszahlungSchema,
  wertsachenArraySchema,
} from "~/flows/shared/finanzielleAngaben/context";
import type { FinanzielleAngabenPartnerContext } from "~/flows/shared/finanzielleAngaben/partner/context";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { createDateSchema } from "~/services/validation/date";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";
import { today } from "~/util/date";

export const beratungshilfeFinanzielleAngaben = {
  einkommen: buildMoneyValidationSchema(),
  erwerbstaetig: YesNoAnswer,
  staatlicheLeistungen,
  berufart: z.object({
    selbststaendig: checkedOptional,
    festangestellt: checkedOptional,
  }),
  weitereseinkommen: z.object({
    unterhaltszahlungen: checkedOptional,
    arbeitlosengeld: checkedOptional,
    wohngeld: checkedOptional,
    kindergeld: checkedOptional,
    bafoeg: checkedOptional,
    krankengeld: checkedOptional,
    rente: checkedOptional,
    elterngeld: checkedOptional,
    insolvenzgeld: checkedOptional,
    ueberbrueckungsgeld: checkedOptional,
    others: checkedOptional,
  }),
  berufsituation: z.enum(
    ["pupil", "student", "retiree", "no"],
    customRequiredErrorMessage,
  ),
  partnerEinkommenSumme: buildMoneyValidationSchema(),
  hasKinder: YesNoAnswer,
  kinder: kinderArraySchema,
  hasBankkonto: YesNoAnswer,
  bankkonten: bankkontenArraySchema,
  hasKraftfahrzeug: YesNoAnswer,
  kraftfahrzeuge: kraftfahrzeugeArraySchema,
  hasGeldanlage: YesNoAnswer,
  geldanlagen: gelanlagenArraySchema,
  eigentumTotalWorth: z.enum(
    ["less10000", "more10000", "unsure"],
    customRequiredErrorMessage,
  ),
  hasGrundeigentum: YesNoAnswer,
  grundeigentum: grundeigentumArraySchema,
  hasWertsache: YesNoAnswer,
  wertsachen: wertsachenArraySchema,
  livingSituation: z.enum(
    ["alone", "withRelatives", "withOthers"],
    customRequiredErrorMessage,
  ),
  apartmentSizeSqm: integerSchema,
  apartmentPersonCount: integerSchema,
  apartmentCostOwnShare: buildMoneyValidationSchema(),
  apartmentCostFull: buildMoneyValidationSchema(),
  apartmentCostAlone: buildMoneyValidationSchema(),
  hasWeitereUnterhaltszahlungen: YesNoAnswer,
  unterhaltszahlungen: z.array(unterhaltszahlungSchema),
  hasAusgaben: YesNoAnswer,
  ausgabensituation: besondereBelastungenSchema,
  ausgaben: z.array(
    z.object({
      art: stringRequiredSchema,
      zahlungsempfaenger: stringRequiredSchema,
      beitrag: buildMoneyValidationSchema(),
      hasZahlungsfrist: YesNoAnswer,
      zahlungsfrist: createDateSchema({
        earliest: () => today(),
      }),
    }),
  ),
  pageData: pageDataSchema,
};

const _contextObject = z.object(beratungshilfeFinanzielleAngaben).partial();
export type BeratungshilfeFinanzielleAngaben = z.infer<typeof _contextObject> &
  FinanzielleAngabenPartnerContext;
