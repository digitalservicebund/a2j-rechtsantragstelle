import { z } from "zod";
import {
  besondereBelastungenSchema,
  bankkontenArraySchema,
  geldanlagenArraySchema,
  grundeigentumArraySchema,
  kinderArraySchema,
  kraftfahrzeugeArraySchema,
  staatlicheLeistungen,
  unterhaltszahlungSchema,
  wertsachenArraySchema,
  livingSituationSchema,
} from "~/domains/shared/formular/finanzielleAngaben/context";
import { finanzielleAngabenPartnerInputSchema } from "~/domains/shared/formular/finanzielleAngaben/partner/inputSchema";
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

export const beratungshilfeFinanzielleAngabenInputSchema = {
  ...finanzielleAngabenPartnerInputSchema,
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
  hasKinder: YesNoAnswer,
  kinder: kinderArraySchema,
  hasBankkonto: YesNoAnswer,
  bankkonten: bankkontenArraySchema,
  hasKraftfahrzeug: YesNoAnswer,
  kraftfahrzeuge: kraftfahrzeugeArraySchema,
  hasGeldanlage: YesNoAnswer,
  geldanlagen: geldanlagenArraySchema,
  eigentumTotalWorth: z.enum(
    ["less10000", "more10000", "unsure"],
    customRequiredErrorMessage,
  ),
  hasGrundeigentum: YesNoAnswer,
  grundeigentum: grundeigentumArraySchema,
  hasWertsache: YesNoAnswer,
  wertsachen: wertsachenArraySchema,
  livingSituation: livingSituationSchema,
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
    z
      .object({
        art: stringRequiredSchema,
        zahlungsempfaenger: stringRequiredSchema,
        beitrag: buildMoneyValidationSchema(),
        hasZahlungsfrist: YesNoAnswer,
        zahlungsfrist: createDateSchema({
          earliest: () => today(),
        }),
      })
      .partial(),
  ),
  pageData: pageDataSchema,
};

const _partialSchema = z.object(beratungshilfeFinanzielleAngabenInputSchema).partial();
export type BeratungshilfeFinanzielleAngabenUserData = z.infer<typeof _partialSchema>;
