import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";

export const erbscheinWegweiserPages = {
  start: {
    stepId: "start",
  },
  lebensmittelpunkt: {
    stepId: "grundvoraussetzungen/lebensmittelpunkt",
    pageSchema: {
      lebensmittelpunkt: z.enum(["deutschland", "ausland"]),
    },
  },
} as const satisfies PagesConfig;
