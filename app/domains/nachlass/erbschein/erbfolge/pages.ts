import { z } from "zod";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { createNumberIncrementSchema } from "~/services/validation/numberIncrement";
import { dynamicSelectZodDescription } from "~/services/validation/dynamicSelect";

export type Kind =
  | { name: string; isAlive: "yes" }
  | { name: string; isAlive: "no"; hatteKinder: "no" }
  | { name: string; isAlive: "no"; hatteKinder: "yes"; kinder?: Kind[] };

const gueterstandSchema = z.enum([
  "communityOfAcquisitions",
  "separationOfProperty",
  "communityOfProperty",
  "other",
  "unknown",
]);
export type Gueterstand = z.infer<typeof gueterstandSchema>;

const kindNameSchema = z.string();

const kindSchema: z.ZodType<Kind> = z.lazy(() =>
  z.union([
    z.object({ name: kindNameSchema, isAlive: z.literal("yes") }),
    z.object({
      name: kindNameSchema,
      isAlive: z.literal("no"),
      hatteKinder: z.literal("no"),
    }),
    z.object({
      name: kindNameSchema,
      isAlive: z.literal("no"),
      hatteKinder: z.literal("yes"),
      kinder: z.array(kindSchema).optional(),
    }),
  ]),
);

const kinderArray = z.array(kindSchema);

// Dynamic parent select values: stringified index, "" or absent. The valid index
// range is runtime data, so consumers fall back to the physical parent.
const parentKindIndexSchema = z
  .string()
  .regex(/^\d*$/)
  .optional()
  .describe(dynamicSelectZodDescription);

// Elternteil variant also allows "both" (full sibling).
const parentElternteilIndexSchema = z
  .string()
  .regex(/^(\d*|both)$/)
  .optional()
  .describe(dynamicSelectZodDescription);

const kindDatenSchema = (prefix: string) => ({
  [`${prefix}name`]: kindNameSchema,
  [`${prefix}isAlive`]: YesNoAnswer,
});

const kindHatteKinderSchema = (prefix: string) => ({
  [`${prefix}hatteKinder`]: YesNoAnswer,
});

// Deepest level — no further nesting
const elternteilGrandchildSchema = z.object({
  name: z.string(),
  isAlive: YesNoAnswer,
});

// Which of the deceased's parents this sibling belongs to: parent index ("0"/"1")
// or "both" (full sibling). Injected at runtime by the dynamic parent select.
export type ParentElternteilIndex = string;

export type ElternteilKind =
  | { name: string; isAlive: "yes"; parentElternteilIndex?: ParentElternteilIndex }
  | {
      name: string;
      isAlive: "no";
      hatteKinder: "no";
      parentElternteilIndex?: ParentElternteilIndex;
    }
  | {
      name: string;
      isAlive: "no";
      hatteKinder: "yes";
      kinder?: Array<{ name: string; isAlive: "yes" | "no" }>;
      parentElternteilIndex?: ParentElternteilIndex;
    };

const elternteilKindSchema: z.ZodType<ElternteilKind> = z.union([
  z.object({
    name: z.string(),
    isAlive: z.literal("yes"),
    parentElternteilIndex: z.string().optional(),
  }),
  z.object({
    name: z.string(),
    isAlive: z.literal("no"),
    hatteKinder: z.literal("no"),
    parentElternteilIndex: z.string().optional(),
  }),
  z.object({
    name: z.string(),
    isAlive: z.literal("no"),
    hatteKinder: z.literal("yes"),
    kinder: z.array(elternteilGrandchildSchema).optional(),
    parentElternteilIndex: z.string().optional(),
  }),
]);

export type Elternteil =
  | { name: string; isAlive: "yes" }
  | { name: string; isAlive: "no"; hatteKinder: "no" }
  | {
      name: string;
      isAlive: "no";
      hatteKinder: "yes";
      kinder?: ElternteilKind[];
    };

const elternteilSchema: z.ZodType<Elternteil> = z.union([
  z.object({ name: z.string(), isAlive: z.literal("yes") }),
  z.object({
    name: z.string(),
    isAlive: z.literal("no"),
    hatteKinder: z.literal("no"),
  }),
  z.object({
    name: z.string(),
    isAlive: z.literal("no"),
    hatteKinder: z.literal("yes"),
    kinder: z.array(elternteilKindSchema).optional(),
  }),
]);

const elternteileArray = z.array(elternteilSchema);

export const nachlassErbfolgePages = {
  start: { stepId: "/start" },
  verstorbenePerson: {
    stepId: "/verstorbenePerson",
    pageSchema: { name: stringRequiredSchema },
  },
  familienstand: {
    stepId: "/familienstand",
    pageSchema: {
      familienstand: z.enum([
        "ledig",
        "verheiratet",
        "geschieden",
        "verwitwet",
      ]),
    },
  },
  ehepartner: {
    stepId: "/ehepartner",
    pageSchema: { ehepartnerName: stringRequiredSchema },
  },
  ehepartnerStaatsangehoerigkeit: {
    stepId: "/ehepartnerStaatsangehoerigkeit",
    pageSchema: {
      ehepartnerStaatsangehoerigkeit: z.enum([
        "nurDeutsch",
        "deutschUndWeitere",
        "keineDeutsch",
      ]),
    },
  },
  auslandsbezug: {
    stepId: "/ergebnis/auslandsbezug",
  },
  inDeutschlandGeheiratet: {
    stepId: "/inDeutschlandGeheiratet",
    pageSchema: { inDeutschlandGeheiratet: YesNoAnswer },
  },
  ehevertrag: {
    stepId: "/ehevertrag",
    pageSchema: {
      ehevertrag: z.enum(["yes", "no", "unknown"]),
    },
  },
  gueterstand: {
    stepId: "/gueterstand",
    pageSchema: {
      gueterstand: gueterstandSchema,
    },
  },
  kinder: {
    stepId: "/hatteKinder",
    pageSchema: { hatteKinder: YesNoAnswer },
  },
  kinderAnzahl: {
    stepId: "/kinderAnzahl",
    pageSchema: { kinderAnzahl: createNumberIncrementSchema(1) },
  },
  kind1Summary: {
    stepId: "/kinder",
    arraySummary: { name: "kinder", schema: kinderArray },
  },
  kind1Daten: {
    stepId: "/kinder/#/daten",
    pageSchema: kindDatenSchema("kinder#"),
  },
  kind1HatteKinder: {
    stepId: "/kinder/#/hatteKinder",
    pageSchema: kindHatteKinderSchema("kinder#"),
  },
  kind1KinderAnzahl: {
    stepId: "/kinder/#/kinderAnzahl",
    pageSchema: { "kinder#kinderAnzahl": createNumberIncrementSchema(1) },
  },
  kind2Daten: {
    stepId: "/kinder/#/kinder/#/daten",
    pageSchema: {
      ...kindDatenSchema("kinder#kinder#"),
      "kinder#kinder#parentKindIndex": parentKindIndexSchema,
    },
  },
  kind2HatteKinder: {
    stepId: "/kinder/#/kinder/#/hatteKinder",
    pageSchema: kindHatteKinderSchema("kinder#kinder#"),
  },
  kind2KinderAnzahl: {
    stepId: "/kinder/#/kinder/#/kinderAnzahl",
    pageSchema: {
      "kinder#kinder#kinderAnzahl": createNumberIncrementSchema(1),
    },
  },
  kind3Daten: {
    stepId: "/kinder/#/kinder/#/kinder/#/daten",
    pageSchema: {
      ...kindDatenSchema("kinder#kinder#kinder#"),
      "kinder#kinder#kinder#parentKindIndex": parentKindIndexSchema,
    },
  },
  kind3HatteKinder: {
    stepId: "/kinder/#/kinder/#/kinder/#/hatteKinder",
    pageSchema: kindHatteKinderSchema("kinder#kinder#kinder#"),
  },
  kind3KinderAnzahl: {
    stepId: "/kinder/#/kinder/#/kinder/#/kinderAnzahl",
    pageSchema: {
      "kinder#kinder#kinder#kinderAnzahl": createNumberIncrementSchema(1),
    },
  },
  kind4Daten: {
    stepId: "/kinder/#/kinder/#/kinder/#/kinder/#/daten",
    pageSchema: {
      ...kindDatenSchema("kinder#kinder#kinder#kinder#"),
      "kinder#kinder#kinder#kinder#parentKindIndex": parentKindIndexSchema,
    },
  },
  kind4HatteKinder: {
    stepId: "/kinder/#/kinder/#/kinder/#/kinder/#/hatteKinder",
    pageSchema: kindHatteKinderSchema("kinder#kinder#kinder#kinder#"),
  },
  kind4KinderAnzahl: {
    stepId: "/kinder/#/kinder/#/kinder/#/kinder/#/kinderAnzahl",
    pageSchema: {
      "kinder#kinder#kinder#kinder#kinderAnzahl":
        createNumberIncrementSchema(1),
    },
  },
  kind5Daten: {
    stepId: "/kinder/#/kinder/#/kinder/#/kinder/#/kinder/#/daten",
    pageSchema: {
      ...kindDatenSchema("kinder#kinder#kinder#kinder#kinder#"),
      "kinder#kinder#kinder#kinder#kinder#parentKindIndex":
        parentKindIndexSchema,
    },
  },
  elternteilSummary: {
    stepId: "/elternteile",
    arraySummary: { name: "elternteile", schema: elternteileArray },
  },
  elternteilDaten: {
    stepId: "/elternteile/#/daten",
    pageSchema: {
      "elternteile#name": z.string(),
      "elternteile#isAlive": YesNoAnswer,
    },
  },
  elternteilHatteKinder: {
    stepId: "/elternteile/#/hatteKinder",
    pageSchema: { "elternteile#hatteKinder": YesNoAnswer },
  },
  elternteilKinderAnzahl: {
    stepId: "/elternteile/#/kinderAnzahl",
    pageSchema: { "elternteile#kinderAnzahl": createNumberIncrementSchema(1) },
  },
  elternteilKindDaten: {
    stepId: "/elternteile/#/kinder/#/daten",
    pageSchema: {
      "elternteile#kinder#parentElternteilIndex": parentElternteilIndexSchema,
      "elternteile#kinder#name": z.string(),
      "elternteile#kinder#isAlive": YesNoAnswer,
    },
  },
  elternteilKindHatteKinder: {
    stepId: "/elternteile/#/kinder/#/hatteKinder",
    pageSchema: { "elternteile#kinder#hatteKinder": YesNoAnswer },
  },
  elternteilKindKinderAnzahl: {
    stepId: "/elternteile/#/kinder/#/kinderAnzahl",
    pageSchema: {
      "elternteile#kinder#kinderAnzahl": createNumberIncrementSchema(1),
    },
  },
  elternteilKindKindDaten: {
    stepId: "/elternteile/#/kinder/#/kinder/#/daten",
    pageSchema: {
      "elternteile#kinder#kinder#name": z.string(),
      "elternteile#kinder#kinder#isAlive": YesNoAnswer,
    },
  },
  ergebnis: {
    stepId: "/ergebnis/erbfolge",
  },
} as const;

export type NachlassErbfolgePages = typeof nachlassErbfolgePages;
