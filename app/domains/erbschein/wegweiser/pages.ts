import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const erbscheinWegweiserPages = {
  start: {
    stepId: "start",
  },
  staatsangehoerigkeit: {
    stepId: "staatsangehoerigkeit",
    pageSchema: {
      staatsangehoerigkeit: z.enum(["german", "germanAndOther", "other"]),
    },
  },
  lebensmittelpunkt: {
    stepId: "lebensmittelpunkt",
    pageSchema: {
      lebensmittelpunkt: z.enum(["deutschland", "ausland"]),
    },
  },
  auslaendischerErbfall: {
    stepId: "ergebnis/auslandsbezug",
  },
  testamentOderErbvertrag: {
    stepId: "testament-oder-erbvertrag",
    pageSchema: {
      testamentType: z.enum(["none", "handwritten", "notarized", "erbvertrag"]),
    },
  },
  notarizedTestament: {
    stepId: "ergebnis/erbschein-nicht-erforderlich-notarielles-testament",
  },
  erbvertrag: {
    stepId: "ergebnis/erbschein-nicht-erforderlich-erbvertrag",
  },
  grundeigentum: {
    stepId: "grundeigentum",
    pageSchema: {
      hasGrundeigentum: YesNoAnswer,
    },
  },
  erbscheinRequiredHandwrittenTestament: {
    stepId: "ergebnis/erbschein-erforderlich-handschriftliches-testament",
  },
  erbscheinRequiredNoTestament: {
    stepId: "ergebnis/erbschein-erforderlich-kein-testament",
  },
  unternehmen: {
    stepId: "unternehmen",
    pageSchema: {
      hasUnternehmen: YesNoAnswer,
    },
  },
  bankRequestedErbschein: {
    stepId: "erbschein-verlangt",
    pageSchema: {
      bankRequestedErbschein: YesNoAnswer,
    },
  },
  erbscheinNotRequired: {
    stepId: "ergebnis/erbschein-nicht-erforderlich-nicht-verlangt",
  },
} as const satisfies PagesConfig;
