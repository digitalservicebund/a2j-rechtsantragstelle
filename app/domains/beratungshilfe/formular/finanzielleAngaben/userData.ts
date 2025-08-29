import { type BeratungshilfeFinanzielleAngabenRegelmassigeAusgabenUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/regelmaessigeAusgaben/userData";
import { type BeratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenUserData } from "./andereUnterhaltszahlungen/userData";
import { type BeratungshilfeFinanzielleAngabenEigentumUserData } from "./eigentum/userData";
import { type BeratungshilfeFinanzielleAngabenEinkommenUserData } from "./einkommen/userData";
import { type BeratungshilfeFinanzielleAngabenKinderUserData } from "./kinder/userData";
import { type BeratungshilfeFinanzielleAngabenPartnerUserData } from "./partner/userData";
import { type BeratungshilfeFinanzielleAngabenWohnungUserData } from "./wohnung/userData";

export type BeratungshilfeFinanzielleAngabenUserData =
  BeratungshilfeFinanzielleAngabenEinkommenUserData &
    BeratungshilfeFinanzielleAngabenPartnerUserData &
    BeratungshilfeFinanzielleAngabenKinderUserData &
    BeratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenUserData &
    BeratungshilfeFinanzielleAngabenWohnungUserData &
    BeratungshilfeFinanzielleAngabenEigentumUserData &
    BeratungshilfeFinanzielleAngabenRegelmassigeAusgabenUserData & {
      pageData?: {
        arrayIndexes: number[];
      };
    };
