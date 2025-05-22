import { z } from "zod";
import {
  financialEntryInputSchema,
  staatlicheLeistungenInputSchema,
} from "~/domains/shared/formular/finanzielleAngaben/userData";
import { adresseSchema } from "~/domains/shared/formular/persoenlicheDaten/userData";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const prozesskostenhilfeFinanzielleAngabenEinkuenfteContext = {
  staatlicheLeistungen: z.enum(
    [...staatlicheLeistungenInputSchema.options, "arbeitslosengeld"],
    customRequiredErrorMessage,
  ),
  buergergeld: buildMoneyValidationSchema(),
  arbeitslosengeld: buildMoneyValidationSchema(),
  currentlyEmployed: YesNoAnswer,
  employmentType: z.enum(
    ["employed", "selfEmployed", "employedAndSelfEmployed"],
    customRequiredErrorMessage,
  ),
  nettoEinkuenfteAlsArbeitnehmer: buildMoneyValidationSchema(),
  selbststaendigMonatlichesEinkommen: buildMoneyValidationSchema(),
  selbststaendigBruttoNetto: z.enum(
    ["brutto", "netto"],
    customRequiredErrorMessage,
  ),
  selbststaendigAbzuege: buildMoneyValidationSchema(),
  arbeitsweg: z.enum(
    ["publicTransport", "privateVehicle", "bike", "walking", "none"],
    customRequiredErrorMessage,
  ),
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

const _contextObject = z
  .object(prozesskostenhilfeFinanzielleAngabenEinkuenfteContext)
  .partial();
export type ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext = z.infer<
  typeof _contextObject
>;
