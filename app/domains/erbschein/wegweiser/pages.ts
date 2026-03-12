import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

// --- Erbfolge array schemas ---

const enkelkinderArraySchema = z.array(
  z.object({ vorname: stringRequiredSchema }).partial(),
);

const kinderArraySchema = z.array(
  z
    .object({
      vorname: stringRequiredSchema,
      istVerstorben: YesNoAnswer,
      enkelkinder: enkelkinderArraySchema,
    })
    .partial(),
);

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

  // --- Erbfolge: nested arrays PoC ---
  // Overview page showing all children (no array index in URL)
  kinderUebersicht: {
    stepId: "erbfolge/kinder/uebersicht",
  },
  // Parent/container node for the kinder array
  kinderDaten: {
    stepId: "erbfolge/kinder/kind",
    pageSchema: { kinder: kinderArraySchema },
    arrayField: "kinder",
    arrayPages: {
      // Level 1: each child's form page (plain field names, no #)
      daten: {
        pageSchema: {
          vorname: stringRequiredSchema,
          istVerstorben: YesNoAnswer,
        },
      },
      // Grandchildren container within a specific child
      enkelkinder: {
        arrayPages: {
          // Overview page for grandchildren of child X
          uebersicht: {},
          // Parent/container for the enkelkinder array (level 2)
          enkelkind: {
            arrayField: "enkelkinder",
            arrayPages: {
              // Level 2: each grandchild's form page
              daten: {
                pageSchema: {
                  vorname: stringRequiredSchema,
                },
              },
            },
          },
        },
      },
    },
  },
} as const satisfies PagesConfig;
