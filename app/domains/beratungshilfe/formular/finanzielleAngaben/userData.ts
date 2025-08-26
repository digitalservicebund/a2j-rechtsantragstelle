import { z } from "zod";
import { finanzielleAngabenPartnerInputSchema } from "~/domains/shared/formular/finanzielleAngaben/partner/inputSchema";
import {
  besondereBelastungenInputSchema,
  bankkontenArraySchema,
  geldanlagenArraySchema,
  grundeigentumArraySchema,
  kraftfahrzeugeArraySchema,
  wertsachenArraySchema,
  livingSituationInputSchema,
} from "~/domains/shared/formular/finanzielleAngaben/userData";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { createDateSchema } from "~/services/validation/date";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { today } from "~/util/date";
import { type BeratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenUserData } from "./andereUnterhaltszahlungen/userData";
import { type BeratungshilfeFinanzielleAngabenEinkommenUserData } from "./einkommen/userData";
import { type BeratungshilfeFinanzielleAngabenKinderUserData } from "./kinder/userData";
import { type BeratungshilfeFinanzielleAngabenPartnerUserData } from "./partner/userData";

export const beratungshilfeFinanzielleAngabenInputSchema = {
  ...finanzielleAngabenPartnerInputSchema,
  hasBankkonto: YesNoAnswer,
  bankkonten: bankkontenArraySchema,
  hasKraftfahrzeug: YesNoAnswer,
  kraftfahrzeuge: kraftfahrzeugeArraySchema,
  hasGeldanlage: YesNoAnswer,
  geldanlagen: geldanlagenArraySchema,
  hasGrundeigentum: YesNoAnswer,
  grundeigentum: grundeigentumArraySchema,
  hasWertsache: YesNoAnswer,
  wertsachen: wertsachenArraySchema,
  livingSituation: livingSituationInputSchema,
  apartmentSizeSqm: integerSchema,
  apartmentPersonCount: integerSchema,
  apartmentCostOwnShare: buildMoneyValidationSchema(),
  apartmentCostFull: buildMoneyValidationSchema(),
  apartmentCostAlone: buildMoneyValidationSchema(),
  hasAusgaben: YesNoAnswer,
  ausgabensituation: besondereBelastungenInputSchema,
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

const _partialSchema = z
  .object(beratungshilfeFinanzielleAngabenInputSchema)
  .partial();
export type BeratungshilfeFinanzielleAngabenUserData = z.infer<
  typeof _partialSchema
> &
  BeratungshilfeFinanzielleAngabenEinkommenUserData &
  BeratungshilfeFinanzielleAngabenPartnerUserData &
  BeratungshilfeFinanzielleAngabenKinderUserData &
  BeratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenUserData;
