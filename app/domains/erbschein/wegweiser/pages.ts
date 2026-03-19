import { z } from "zod";
import { type ArrayPage, type PagesConfig } from "~/domains/pageSchemas";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

// --- Erbfolge: recursive Zod schemas (bottom-up by depth) ---

const MAX_ERBFOLGE_DEPTH = 2;

// Count schema for "geschlossen" variant (1-20 range)
// Uses string type for form rendering compatibility, transforms to number
const anzahlSchema = z
  .string()
  .min(1, "required")
  .refine((v) => /^\d+$/.test(v), { message: "wrong_format" })
  .transform((v) => Number.parseInt(v, 10))
  .refine((v) => v >= 1, { message: "too_little" })
  .refine((v) => v <= 20, { message: "too_much" })
  .transform(String);

// Internal number schema for array validation (used in nested schemas)
const anzahlNumberSchema = z.coerce.number().int().min(1).max(20);

// Leaf level (maxDepth): children only need a name
const kinderDepth2Schema = z.array(
  z.object({
    vorname: stringRequiredSchema,
    istVerstorben: YesNoAnswer,
  }),
);

// Depth 1: children can have their own children (depth 2)
const kinderDepth1Schema = z.array(
  z.object({
    vorname: stringRequiredSchema,
    istVerstorben: YesNoAnswer,
    hatKinder: YesNoAnswer.optional(),
    kinderAnzahl: anzahlNumberSchema.optional(),
    kinder: kinderDepth2Schema.optional(),
  }),
);

// Depth 0: top-level children of the deceased
const kinderSchema = z.array(
  z.object({
    vorname: stringRequiredSchema,
    istVerstorben: YesNoAnswer,
    hatKinder: YesNoAnswer.optional(),
    kinderAnzahl: anzahlNumberSchema.optional(),
    kinder: kinderDepth1Schema.optional(),
  }),
);

const kinderSchemasByDepth = [
  kinderSchema,
  kinderDepth1Schema,
  kinderDepth2Schema,
];

// --- 2nd Order Relatives: Siblings with nieces/nephews ---

// Leaf level: great-nieces/nephews (children of nieces/nephews)
const grossnichtenDepth2Schema = z.array(
  z.object({
    vorname: stringRequiredSchema,
  }),
);

// Depth 1: nieces/nephews (children of siblings)
const nichtenNeffenSchema = z.array(
  z.object({
    vorname: stringRequiredSchema,
    istVerstorben: YesNoAnswer,
    hatKinder: YesNoAnswer.optional(),
    kinderAnzahl: anzahlNumberSchema.optional(),
    kinder: grossnichtenDepth2Schema.optional(),
  }),
);

// Siblings schema (full + half)
const geschwisterSchema = z.array(
  z.object({
    vorname: stringRequiredSchema,
    istVerstorben: YesNoAnswer,
    istHalbgeschwister: z.boolean().optional(),
    hatKinder: YesNoAnswer.optional(),
    kinderAnzahl: anzahlNumberSchema.optional(),
    kinder: nichtenNeffenSchema.optional(),
  }),
);

// Parents schema (max 2)
const elternSchema = z.array(
  z.object({
    vorname: stringRequiredSchema,
    istVerstorben: YesNoAnswer,
  }),
);

/**
 * Generate recursive array pages for erbfolge at a given depth.
 * Geschlossen variant: anzahl (count) → eingabe (multi-item page) → (if deceased) → recursive
 * Non-leaf levels: daten, anzahl (if has children), eingabe (multi-item), recursive.
 * Leaf level: eingabe only (no further recursion).
 */
function makeErbfolgeArrayPages(
  maxDepth: number,
  depth = 0,
): Record<string, ArrayPage> {
  if (depth < maxDepth) {
    return {
      daten: {
        pageSchema: {
          vorname: stringRequiredSchema,
          istVerstorben: YesNoAnswer,
        },
      },
      frage: {
        pageSchema: { hatKinder: YesNoAnswer },
      },
      anzahl: {
        pageSchema: { kinderAnzahl: anzahlSchema },
      },
      uebersicht: {},
      kind: {
        arraySchema: { kinder: kinderSchemasByDepth[depth + 1] },
        arrayPages: makeErbfolgeArrayPages(maxDepth, depth + 1),
      },
    };
  }

  // Leaf level: no recursion possible
  return {
    daten: {
      pageSchema: {
        vorname: stringRequiredSchema,
        istVerstorben: YesNoAnswer,
      },
    },
  };
}

/**
 * Generate array pages for siblings (geschwister) with nieces/nephews nesting.
 */
function makeGeschwisterArrayPages(): Record<string, ArrayPage> {
  return {
    daten: {
      pageSchema: {
        vorname: stringRequiredSchema,
        istVerstorben: YesNoAnswer,
        istHalbgeschwister: z.boolean().optional(),
      },
    },
    frage: {
      pageSchema: { hatKinder: YesNoAnswer },
    },
    anzahl: {
      pageSchema: { kinderAnzahl: anzahlSchema },
    },
    uebersicht: {},
    kind: {
      arraySchema: { kinder: nichtenNeffenSchema },
      arrayPages: {
        daten: {
          pageSchema: {
            vorname: stringRequiredSchema,
            istVerstorben: YesNoAnswer,
          },
        },
        frage: {
          pageSchema: { hatKinder: YesNoAnswer },
        },
        anzahl: {
          pageSchema: { kinderAnzahl: anzahlSchema },
        },
        uebersicht: {},
        kind: {
          arraySchema: { kinder: grossnichtenDepth2Schema },
          arrayPages: {
            daten: {
              pageSchema: {
                vorname: stringRequiredSchema,
              },
            },
          },
        },
      },
    },
  };
}

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
    stepId: "ergebnis/auslaendische-erbfaelle",
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
    stepId: "erbschein-erforderlich-handschriftliches-testament",
  },
  erbscheinRequiredNoTestament: {
    stepId: "erbschein-erforderlich-kein-testament",
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

  // =============================================================================
  // ERBFOLGE: Family tree collection (geschlossen variant)
  // =============================================================================

  // --- Spouse (Ehepartner) - single entity ---
  ehepartnerFrage: {
    stepId: "erbfolge-ehepartner-frage",
    pageSchema: { hatEhepartner: YesNoAnswer },
  },
  ehepartnerDaten: {
    stepId: "erbfolge-ehepartner-daten",
    pageSchema: {
      ehepartnerVorname: stringRequiredSchema,
      ehepartnerIstVerstorben: YesNoAnswer,
    },
  },

  // --- 1st Order: Children (Kinder) ---
  kinderFrage: {
    stepId: "erbfolge-kinder-frage",
    pageSchema: { hatKinder: YesNoAnswer },
  },
  kinderAnzahl: {
    stepId: "erbfolge-kinder-anzahl",
    pageSchema: { kinderAnzahl: anzahlSchema },
  },
  kinderEingabe: {
    stepId: "erbfolge-kinder-eingabe",
    arraySchema: { kinder: kinderSchema },
    arrayPages: makeErbfolgeArrayPages(MAX_ERBFOLGE_DEPTH),
  },
  kinderUebersicht: {
    stepId: "erbfolge-kinder-uebersicht",
  },

  // --- 2nd Order: Parents (Eltern) - only if no 1st order heirs ---
  elternFrage: {
    stepId: "erbfolge-eltern-frage",
    pageSchema: { hatEltern: YesNoAnswer },
  },
  elternEingabe: {
    stepId: "erbfolge-eltern-eingabe",
    pageSchema: {
      eltern: elternSchema,
    },
  },

  // --- 2nd Order: Siblings (Geschwister) - for inheritance by representation ---
  geschwisterFrage: {
    stepId: "erbfolge-geschwister-frage",
    pageSchema: { hatGeschwister: YesNoAnswer },
  },
  geschwisterAnzahl: {
    stepId: "erbfolge-geschwister-anzahl",
    pageSchema: { geschwisterAnzahl: anzahlSchema },
  },
  geschwisterEingabe: {
    stepId: "erbfolge-geschwister-eingabe",
    arraySchema: { geschwister: geschwisterSchema },
    arrayPages: makeGeschwisterArrayPages(),
  },
  geschwisterUebersicht: {
    stepId: "erbfolge-geschwister-uebersicht",
  },

  // --- Result page after family tree collection ---
  erbfolgeErgebnis: {
    stepId: "ergebnis/erbfolge-ergebnis",
  },
} as const satisfies PagesConfig;
