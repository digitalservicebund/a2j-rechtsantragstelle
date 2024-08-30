import { z } from "zod";
import { staatlicheLeistungen } from "~/flows/beratungshilfeVorabcheck/context";
import {
  besondereBelastungenSchema,
  bankkontenArraySchema,
  eigentumTotalWorthSchema,
  gelanlagenArraySchema,
  grundeigentumArraySchema,
  kinderArraySchema,
  kraftfahrzeugeArraySchema,
  partnerschaftSchema,
  unterhaltszahlungSchema,
  wertsachenArraySchema,
} from "~/flows/shared/finanzielleAngaben/context";
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
  partnerschaft: partnerschaftSchema,
  zusammenleben: YesNoAnswer,
  unterhalt: YesNoAnswer,
  unterhaltsSumme: buildMoneyValidationSchema(),
  partnerEinkommen: YesNoAnswer,
  partnerEinkommenSumme: buildMoneyValidationSchema(),
  partnerVorname: stringRequiredSchema,
  partnerNachname: stringRequiredSchema,
  hasKinder: YesNoAnswer,
  kinder: kinderArraySchema,
  hasBankkonto: YesNoAnswer,
  bankkonten: bankkontenArraySchema,
  hasKraftfahrzeug: YesNoAnswer,
  kraftfahrzeuge: kraftfahrzeugeArraySchema,
  hasGeldanlage: YesNoAnswer,
  geldanlagen: gelanlagenArraySchema,
  eigentumTotalWorth: eigentumTotalWorthSchema,
  hasGrundeigentum: YesNoAnswer,
  grundeigentum: grundeigentumArraySchema,
  hasWertsache: YesNoAnswer,
  wertsachen: wertsachenArraySchema,
  livingSituation: z.enum(["alone", "withRelatives", "withOthers"]),
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
export type BeratungshilfeFinanzielleAngaben = z.infer<typeof _contextObject>;
