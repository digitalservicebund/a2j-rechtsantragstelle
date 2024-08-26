import { z } from "zod";
import {
  bankkontenArraySchema,
  eigentumTotalWorthSchema,
  gelanlagenArraySchema,
  grundeigentumArraySchema,
  kinderArraySchema,
  kraftfahrzeugeArraySchema,
  partnerschaftSchema,
  staatlicheLeistungen,
  unterhaltszahlungSchema,
  wertsachenArraySchema,
} from "~/flows/shared/finanzielleAngaben/context";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const staatlicheLeistungenPKHSchema = z.enum(
  [...staatlicheLeistungen.options, "arbeitslosengeld"],
  customRequiredErrorMessage,
);

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

export const prozesskostenhilfeFinanzielleAngabenContext = {
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
  receivesPension: YesNoAnswer,
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
  hasWeitereUnterhaltszahlungen: YesNoAnswer,
  unterhaltszahlungen: z.array(unterhaltszahlungSchema),
  pageData: pageDataSchema,
};

const _contextObject = z
  .object(prozesskostenhilfeFinanzielleAngabenContext)
  .partial();
export type ProzesskostenhilfeFinanzielleAngabenContext = z.infer<
  typeof _contextObject
>;
