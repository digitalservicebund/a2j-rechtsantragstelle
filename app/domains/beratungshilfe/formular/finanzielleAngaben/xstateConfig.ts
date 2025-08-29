import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import type { Config } from "~/services/flow/server/types";
import { beratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenXStateConfig } from "./andereUnterhaltszahlungen/xstateConfig";
import { berhAntragFinanzielleAngabenEigentumXstateConfig } from "./eigentum/xstateConfig";
import { beratungshilfeFinanzielleAngabenEinkommenXstateConfig } from "./einkommen/xstateConfig";
import { beratungshilfeFinanzielleAngabenKinderXstateConfig } from "./kinder/xstateConfig";
import { berhAntragFinanzielleAngabenPages } from "./pages";
import { beratungshilfeFinanzielleAngabenPartnerXstateConfig } from "./partner/xstateConfig";
import { beratungshilfeFinanzielleAngabenRegelmassigeAusgabenXstateConfig } from "./regelmaessigeAusgaben/xstateConfig";
import { type BeratungshilfeFinanzielleAngabenUserData } from "./userData";
import { berhAntragFinanzielleAngabenWohnungXstateConfig } from "./wohnung/xstateConfig";

const steps = xStateTargetsFromPagesConfig(berhAntragFinanzielleAngabenPages);

export const finanzielleAngabenXstateConfig = {
  initial: steps.einkommen.relative,
  id: "finanzielle-angaben",
  on: {
    SUBMIT: "#persoenliche-daten.start",
    BACK: "#rechtsproblem.situation-beschreibung",
  },
  states: {
    einkommen: beratungshilfeFinanzielleAngabenEinkommenXstateConfig,
    partner: beratungshilfeFinanzielleAngabenPartnerXstateConfig,
    kinder: beratungshilfeFinanzielleAngabenKinderXstateConfig,
    "andere-unterhaltszahlungen":
      beratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenXStateConfig,
    wohnung: berhAntragFinanzielleAngabenWohnungXstateConfig,
    eigentum: berhAntragFinanzielleAngabenEigentumXstateConfig,
    ausgaben: beratungshilfeFinanzielleAngabenRegelmassigeAusgabenXstateConfig,
  },
} satisfies Config<BeratungshilfeFinanzielleAngabenUserData>;
