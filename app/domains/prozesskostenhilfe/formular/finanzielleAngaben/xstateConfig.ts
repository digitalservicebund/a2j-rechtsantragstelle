import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/pages";
import type { Config } from "~/services/flow/server/buildFlowController";

import { finanzielleAngabenEinkuenfteXstateConfig } from "./einkuenfte/xStateConfig";
import { andereUnterhaltszahlungenXstateConfig } from "./andere-unterhaltszahlungen/xstateConfig";
import { kinderXstateConfig } from "./kinder/xstateConfig";
import { partnerXstateConfig } from "./partner/xstateConfig";
import { wohnungXstateConfig } from "./wohnung/xstateConfig";
import {
  eigentumXstateConfig,
  eigentumZusammenfassungXstateConfig,
} from "./eigentum/xstateConfig";
import {
  ausgabenXstateConfig,
  ausgabenZusammenfassungXstateConfig,
} from "./ausgaben/xstateConfig";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "./userData";

export const finanzielleAngabenXstateConfig = {
  initial: "einkuenfte",
  id: "finanzielle-angaben",
  states: {
    einkuenfte: finanzielleAngabenEinkuenfteXstateConfig,
    partner: partnerXstateConfig,
    kinder: kinderXstateConfig,
    "andere-unterhaltszahlungen": andereUnterhaltszahlungenXstateConfig,
    wohnung: wohnungXstateConfig,
    eigentum: eigentumXstateConfig,
    "eigentum-zusammenfassung": eigentumZusammenfassungXstateConfig,
    ausgaben: ausgabenXstateConfig,
    "ausgaben-zusammenfassung": ausgabenZusammenfassungXstateConfig,
  },
} satisfies Config<ProzesskostenhilfeFinanzielleAngabenUserData>;
