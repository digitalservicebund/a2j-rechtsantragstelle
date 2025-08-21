import { z } from "zod";
import {
  financialEntryInputSchema,
  staatlicheLeistungenInputSchema,
} from "~/domains/shared/formular/finanzielleAngaben/userData";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { postcodeSchema } from "~/services/validation/postcode";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const adresseSchema = {
  strasseHausnummer: stringRequiredSchema,
  plz: stringRequiredSchema.pipe(postcodeSchema),
  ort: stringRequiredSchema,
};

export const prozesskostenhilfeFinanzielleAngabenEinkuenfteInputSchema = {
  staatlicheLeistungen: z.enum([
    ...staatlicheLeistungenInputSchema.options,
    "arbeitslosengeld",
  ]),
  buergergeld: buildMoneyValidationSchema(),
  arbeitslosengeld: buildMoneyValidationSchema(),
  currentlyEmployed: YesNoAnswer,
  employmentType: z.enum([
    "employed",
    "selfEmployed",
    "employedAndSelfEmployed",
  ]),
  nettoEinkuenfteAlsArbeitnehmer: buildMoneyValidationSchema(),
  selbststaendigMonatlichesEinkommen: buildMoneyValidationSchema(),
  selbststaendigBruttoNetto: z.enum(["brutto", "netto"]),
  selbststaendigAbzuege: buildMoneyValidationSchema(),
  arbeitsweg: z.enum([
    "publicTransport",
    "privateVehicle",
    "bike",
    "walking",
    "none",
  ]),
  monatlicheOPNVKosten: buildMoneyValidationSchema(),
  arbeitsplatz: z.object({ ...adresseSchema }).partial(),
  arbeitsplatzEntfernung: integerSchema.refine((distance) => distance > 0, {
    message: "invalidInteger",
  }),
  hasArbeitsausgaben: YesNoAnswer,
  arbeitsausgaben: z.array(financialEntryInputSchema),
  receivesPension: YesNoAnswer,
  pensionAmount: buildMoneyValidationSchema(),
  hasWohngeld: checkedOptional,
  hasKrankengeld: checkedOptional,
  hasElterngeld: checkedOptional,
  hasKindergeld: checkedOptional,
  wohngeldAmount: buildMoneyValidationSchema(),
  krankengeldAmount: buildMoneyValidationSchema(),
  elterngeldAmount: buildMoneyValidationSchema(),
  kindergeldAmount: buildMoneyValidationSchema(),
  hasFurtherIncome: YesNoAnswer,
  weitereEinkuenfte: z.array(financialEntryInputSchema),
  pageData: pageDataSchema,
};

const _partialSchema = z
  .object(prozesskostenhilfeFinanzielleAngabenEinkuenfteInputSchema)
  .partial();
export type ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData = z.infer<
  typeof _partialSchema
>;
