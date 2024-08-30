import { z } from "zod";
import { staatlicheLeistungen } from "~/flows/shared/finanzielleAngaben/context";
import { adresseSchema } from "~/flows/shared/persoenlicheDaten/context";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const staatlicheLeistungenPKHSchema = z.enum(
  [...staatlicheLeistungen.options, "arbeitslosengeld"],
  customRequiredErrorMessage,
);

export const financialEntrySchema = z.object({
  beschreibung: stringRequiredSchema,
  betrag: buildMoneyValidationSchema(),
  zahlungsfrequenz: z.enum(["monthly", "quarterly", "yearly", "one-time"]),
  proMonat: stringOptionalSchema,
});

export type FinancialEntrySchema = z.infer<typeof financialEntrySchema>;

export const arbeitsArtSchema = z.enum(
  ["employed", "selfEmployed", "employedAndSelfEmployed"],
  customRequiredErrorMessage,
);
export const selbststaendigeBruttoNettoSchema = z.enum(
  ["brutto", "netto"],
  customRequiredErrorMessage,
);

export const arbeitsWegSchema = z.enum(
  ["publicTransport", "privateVehicle", "bike", "walking", "none"],
  customRequiredErrorMessage,
);

export const prozesskostenhilfeFinanzielleAngabenEinkuenfteContext = {
  staatlicheLeistungenPKH: staatlicheLeistungenPKHSchema,
  buergergeld: buildMoneyValidationSchema(),
  arbeitslosengeld: buildMoneyValidationSchema(),
  currentlyEmployed: YesNoAnswer,
  employmentType: arbeitsArtSchema,
  nettoEinkuenfteAlsArbeitnehmer: buildMoneyValidationSchema(),
  selbststaendigesMonatlicheEinkommen: buildMoneyValidationSchema(),
  selbststaendigeBruttoNetto: selbststaendigeBruttoNettoSchema,
  selbststaendigeAbzuege: buildMoneyValidationSchema(),
  arbeitsWeg: arbeitsWegSchema,
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
