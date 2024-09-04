import { z } from "zod";
import { staatlicheLeistungen } from "~/flows/shared/finanzielleAngaben/context";
import { adresseSchema } from "~/flows/shared/persoenlicheDaten/context";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

const financialEntrySchema = z.object({
  beschreibung: stringRequiredSchema,
  betrag: buildMoneyValidationSchema(),
});

export const prozesskostenhilfeFinanzielleAngabenEinkuenfteContext = {
  staatlicheLeistungenPKH: z.enum(
    [...staatlicheLeistungen.options, "arbeitslosengeld"],
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
  arbeitsausgaben: z.array(financialEntrySchema),
  receivesPension: YesNoAnswer,
  pensionAmount: buildMoneyValidationSchema(),
  receivesSupport: YesNoAnswer,
  supportAmount: buildMoneyValidationSchema(),
  hasWohngeld: checkedOptional,
  hasKrankengeld: checkedOptional,
  hasElterngeld: checkedOptional,
  hasKindergeld: checkedOptional,
  wohngeldAmount: buildMoneyValidationSchema(),
  krankengeldAmount: buildMoneyValidationSchema(),
  elterngeldAmount: buildMoneyValidationSchema(),
  kindergeldAmount: buildMoneyValidationSchema(),
  hasFurtherIncome: YesNoAnswer,
  weitereEinkuenfte: z.array(financialEntrySchema),
  pageData: pageDataSchema,
};

const _contextObject = z
  .object(prozesskostenhilfeFinanzielleAngabenEinkuenfteContext)
  .partial();
export type ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext = z.infer<
  typeof _contextObject
>;
