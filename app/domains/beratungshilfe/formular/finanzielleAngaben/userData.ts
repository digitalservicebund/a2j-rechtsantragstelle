import { z } from "zod";
import { besondereBelastungenInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { createDateSchema } from "~/services/validation/date";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { today } from "~/util/date";
import { type BeratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenUserData } from "./andereUnterhaltszahlungen/userData";
import { type BeratungshilfeFinanzielleAngabenEigentumUserData } from "./eigentum/userData";
import { type BeratungshilfeFinanzielleAngabenEinkommenUserData } from "./einkommen/userData";
import { type BeratungshilfeFinanzielleAngabenKinderUserData } from "./kinder/userData";
import { type BeratungshilfeFinanzielleAngabenPartnerUserData } from "./partner/userData";
import { type BeratungshilfeFinanzielleAngabenWohnungUserData } from "./wohnung/userData";

export const beratungshilfeFinanzielleAngabenInputSchema = {
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
  BeratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenUserData &
  BeratungshilfeFinanzielleAngabenWohnungUserData &
  BeratungshilfeFinanzielleAngabenEigentumUserData;
