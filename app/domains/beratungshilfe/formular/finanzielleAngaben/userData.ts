import { z } from "zod";
import {
  bankkontenArraySchema,
  geldanlagenArraySchema,
  grundeigentumArraySchema,
  kraftfahrzeugeArraySchema,
  wertsachenArraySchema,
} from "~/domains/shared/formular/finanzielleAngaben/userData";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { type BeratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenUserData } from "./andereUnterhaltszahlungen/userData";
import { type BeratungshilfeFinanzielleAngabenEinkommenUserData } from "./einkommen/userData";
import { type BeratungshilfeFinanzielleAngabenKinderUserData } from "./kinder/userData";
import { type BeratungshilfeFinanzielleAngabenPartnerUserData } from "./partner/userData";
import { type BeratungshilfeFinanzielleAngabenRegelmassigeAusgabenUserData } from "./regelmaessigeAusgaben/userData";
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
  BeratungshilfeFinanzielleAngabenRegelmassigeAusgabenUserData;
