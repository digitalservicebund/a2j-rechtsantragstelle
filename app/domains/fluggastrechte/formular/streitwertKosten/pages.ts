import type { PagesConfig } from "~/domains/pageSchemas";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
export const fluggastrechteStreitwertKostenPages = {
  streitwertKostenGerichtskosten: {
    stepId: "streitwert-kosten/gerichtskosten",
  },
  streitwertKostenAndereKosten: {
    stepId: "streitwert-kosten/andere-kosten",
  },
  streitwertKostenProzesszinsen: {
    stepId: "streitwert-kosten/prozesszinsen",
    pageSchema: {
      prozesszinsen: YesNoAnswer,
    },
  },
} satisfies PagesConfig;
