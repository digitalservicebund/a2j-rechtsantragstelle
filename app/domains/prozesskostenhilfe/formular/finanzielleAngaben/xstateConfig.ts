import type { Config } from "~/services/flow/server/types";
import { finanzielleAngabenAbzuegeXstateConfig } from "./abzuege/xstateConfig";
import { andereUnterhaltszahlungenXstateConfig } from "./andere-unterhaltszahlungen/xstateConfig";
import { ausgabenXstateConfig } from "./ausgaben/xstateConfig";
import {
  eigentumXstateConfig,
  eigentumZusammenfassungXstateConfig,
} from "./eigentum/xstateConfig";
import { finanzielleAngabenEinkuenfteXstateConfig } from "./einkuenfte/xStateConfig";
import { kinderXstateConfig } from "./kinder/xstateConfig";
import { partnerXstateConfig } from "./partner/xstateConfig";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "./userData";
import { wohnungXstateConfig } from "./wohnung/xstateConfig";

export const finanzielleAngabenXstateConfig = {
  initial: "einkuenfte",
  id: "finanzielle-angaben",
  states: {
    einkuenfte: finanzielleAngabenEinkuenfteXstateConfig,
    abzuege: finanzielleAngabenAbzuegeXstateConfig,
    partner: partnerXstateConfig,
    kinder: kinderXstateConfig,
    "andere-unterhaltszahlungen": andereUnterhaltszahlungenXstateConfig,
    wohnung: wohnungXstateConfig,
    eigentum: eigentumXstateConfig,
    "eigentum-zusammenfassung": eigentumZusammenfassungXstateConfig,
    ausgaben: ausgabenXstateConfig,
  },
} satisfies Config<ProzesskostenhilfeFinanzielleAngabenUserData>;
