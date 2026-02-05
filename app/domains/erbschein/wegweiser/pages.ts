import { z, type ZodType } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { integerSchema } from "~/services/validation/integer";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export type NestedKinder = {
  count?: number;
  entries?: Array<{
    name: string;
    alive: z.infer<typeof YesNoAnswer>;
    hatteKinder?: z.infer<typeof YesNoAnswer>;
    kinder?: NestedKinder;
  }>;
};

export const nestedKinderSchema = z.object({
  count: integerSchema,
  entries: z
    .array(
      z.object({
        name: stringRequiredSchema,
        alive: YesNoAnswer,
        hatteKinder: YesNoAnswer.optional(),
        kinder: z
          .lazy((): ZodType<NestedKinder> => nestedKinderSchema)
          .optional(),
      }),
    )
    .optional(),
});

export const erbscheinWegweiserPages = {
  start: {
    stepId: "start",
  },
  anzahlKinder: {
    stepId: "kinder-recursion/anzahl-kinder",
    pageSchema: {
      kinder: z.object({
        count: integerSchema,
      }),
    },
  },
  kinder: {
    stepId: "kinder-recursion/kinder",
    pageSchema: {
      kinder: nestedKinderSchema,
    },
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
