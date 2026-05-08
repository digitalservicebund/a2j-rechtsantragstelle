import type { PagesConfig } from "~/domains/pageSchemas";
import { checkedRequired } from "~/services/validation/checkedCheckbox";

export const nachlassErbausschlagungAnfragePages = {
  start: {
    stepId: "start/start",
  },
  datenverarbeitung: {
    stepId: "start/datenverarbeitung",
    pageSchema: {
      datenverarbeitungZustimmung: checkedRequired,
    },
  },
} as const satisfies PagesConfig;
