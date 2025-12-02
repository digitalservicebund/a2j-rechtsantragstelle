import type { PagesConfig } from "~/domains/pageSchemas";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
export const fluggastrechteStreitwertKostenPages = {
  streitwertKostenProzesszinsen: {
    stepId: "streitwert-kosten/prozesszinsen",
    pageSchema: {
      prozesszinsen: YesNoAnswer,
    },
  },
  streitwertKostenGerichtskosten: {
    stepId: "streitwert-kosten/gerichtskosten",
  },
} satisfies PagesConfig;
