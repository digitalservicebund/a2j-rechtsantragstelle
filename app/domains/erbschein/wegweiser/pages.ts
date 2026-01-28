import { z, type ZodType } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { integerSchema } from "~/services/validation/integer";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export type NestedKinder = {
  count: number;
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
  verstorbeneName: {
    stepId: "verstorbene-name",
    pageSchema: {
      verstorbeneName: z.string(),
    },
  },
  verstorbeneAnzahlKinder: {
    stepId: "verstorbene-anzahl-kinder",
    pageSchema: {
      kinder: z.object({
        count: integerSchema,
      }),
    },
  },
  kinderDesVerstorbenes: {
    stepId: "kinder-des-verstorbenes",
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
