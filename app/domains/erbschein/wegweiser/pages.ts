import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { integerSchema } from "~/services/validation/integer";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const erbscheinWegweiserPages = {
  start: {
    stepId: "start",
  },
  verstorbeneName: {
    stepId: "verstorbene-name",
    pageSchema: {
      verstorbeneName: z.string(),
    },
  },
  verstorbeneAnzahlKinder: {
    stepId: "verstorbene-anzahl-kinder",
    pageSchema: {
      anzahlKinder: integerSchema,
    },
  },
  kinderDesVerstorbenes: {
    stepId: "kinder-des-verstorbenes",
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
    stepId: "ergebnis/auslaendische-erbfaelle",
  },
  testamentOderErbvertrag: {
    stepId: "testament-oder-erbvertrag",
    pageSchema: {
      testamentType: z.enum(["none", "handwritten", "notarized", "erbvertrag"]),
    },
  },
  notarizedTestament: {
    stepId: "ergebnis/notarized-testament",
  },
  erbvertrag: {
    stepId: "ergebnis/erbvertrag",
  },
  grundeigentum: {
    stepId: "grundeigentum",
    pageSchema: {
      hasGrundeigentum: YesNoAnswer,
    },
  },
  erbscheinRequiredHandwrittenTestament: {
    stepId: "ergebnis/erbschein-required-handwritten-testament",
  },
  erbscheinRequiredNoTestament: {
    stepId: "ergebnis/erbschein-required-no-testament",
  },
  unternehmen: {
    stepId: "unternehmen",
    pageSchema: {
      hasUnternehmen: YesNoAnswer,
    },
  },
  bankRequestedErbschein: {
    stepId: "erbschein-requested-by-bank",
    pageSchema: {
      bankRequestedErbschein: YesNoAnswer,
    },
  },
  erbscheinNotRequired: {
    stepId: "ergebnis/erbschein-not-required",
  },
} as const satisfies PagesConfig;
