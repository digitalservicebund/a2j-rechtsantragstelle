import { z } from "zod";
import {
  besondereBelastungenInputSchema,
  bankkontenArraySchema,
  geldanlagenArraySchema,
  grundeigentumArraySchema,
  kraftfahrzeugeArraySchema,
  unterhaltszahlungInputSchema,
  wertsachenArraySchema,
} from "~/domains/shared/formular/finanzielleAngaben/userData";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { createDateSchema } from "~/services/validation/date";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { today } from "~/util/date";
import { type BeratungshilfeFinanzielleAngabenEinkommenUserData } from "./einkommen/userData";
import { type BeratungshilfeFinanzielleAngabenKinderUserData } from "./kinder/userData";
import { type BeratungshilfeFinanzielleAngabenPartnerUserData } from "./partner/userData";
import { type BeratungshilfeFinanzielleAngabenWohnungUserData } from "./wohnung/userData";

export const beratungshilfeFinanzielleAngabenInputSchema = {
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
  hasWeitereUnterhaltszahlungen: YesNoAnswer,
  unterhaltszahlungen: z.array(unterhaltszahlungInputSchema),
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
  BeratungshilfeFinanzielleAngabenWohnungUserData;
