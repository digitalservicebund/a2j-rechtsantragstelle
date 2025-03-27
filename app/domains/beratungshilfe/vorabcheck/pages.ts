import { beratungshilfeVorabcheckInputSchema } from "./userData";
import type { PagesConfig } from "../../pageConfig";

export const beratungshilfeVorabcheckPages = {
  rechtsschutzversicherung: {
    pageSchema: {
      rechtsschutzversicherung:
        beratungshilfeVorabcheckInputSchema.rechtsschutzversicherung,
    },
  },
  rechtsschutzversicherungDetails: {},
  "rechtsschutzversicherung-details": {
    pageSchema: {
      rsvCoverage: beratungshilfeVorabcheckInputSchema.rsvCoverage,
    },
  },
  "wurde-verklagt": {
    pageSchema: {
      wurdeVerklagt: beratungshilfeVorabcheckInputSchema.wurdeVerklagt,
    },
  },
  "klage-eingereicht": {
    pageSchema: {
      klageEingereicht: beratungshilfeVorabcheckInputSchema.klageEingereicht,
    },
  },
} as const satisfies PagesConfig;
