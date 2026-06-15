import { z } from "zod";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { createNumberIncrementSchema } from "~/services/validation/numberIncrement";

type Kind =
  | { name: string; isAlive: "yes" }
  | { name: string; isAlive: "no"; hatteKinder: "no" }
  | { name: string; isAlive: "no"; hatteKinder: "yes"; kinder?: Kind[] };

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

type ElternteilKind =
  | { name: string; isAlive: "yes" }
  | { name: string; isAlive: "no"; hatteKinder: "no" }
  | {
      name: string;
      isAlive: "no";
      hatteKinder: "yes";
      kinder?: { name: string; isAlive: "yes" | "no" }[];
    };

const elternteilKindSchema: z.ZodType<ElternteilKind> = z.union([
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
    kinder: z.array(elternteilGrandchildSchema).optional(),
  }),
]);

type Elternteil =
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
    collection: "result-pages" as const,
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
      gueterstand: z.enum([
        "communityOfAcquisitions",
        "separationOfProperty",
        "communityOfProperty",
        "other",
        "unknown",
      ]),
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
  kind2Summary: {
    stepId: "/kinder/#/kinder",
    arraySummary: { name: "kinder#kinder", schema: kinderArray },
  },
  kind2Daten: {
    stepId: "/kinder/#/kinder/#/daten",
    pageSchema: kindDatenSchema("kinder#kinder#"),
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
  kind3Summary: {
    stepId: "/kinder/#/kinder/#/kinder",
    arraySummary: { name: "kinder#kinder#kinder", schema: kinderArray },
  },
  kind3Daten: {
    stepId: "/kinder/#/kinder/#/kinder/#/daten",
    pageSchema: kindDatenSchema("kinder#kinder#kinder#"),
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
  kind4Summary: {
    stepId: "/kinder/#/kinder/#/kinder/#/kinder",
    arraySummary: { name: "kinder#kinder#kinder#kinder", schema: kinderArray },
  },
  kind4Daten: {
    stepId: "/kinder/#/kinder/#/kinder/#/kinder/#/daten",
    pageSchema: kindDatenSchema("kinder#kinder#kinder#kinder#"),
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
  kind5Summary: {
    stepId: "/kinder/#/kinder/#/kinder/#/kinder/#/kinder",
    arraySummary: {
      name: "kinder#kinder#kinder#kinder#kinder",
      schema: kinderArray,
    },
  },
  kind5Daten: {
    stepId: "/kinder/#/kinder/#/kinder/#/kinder/#/kinder/#/daten",
    pageSchema: kindDatenSchema("kinder#kinder#kinder#kinder#kinder#"),
  },
  elternteile: {
    stepId: "/elternteilAnzahl",
    pageSchema: { elternteilAnzahl: createNumberIncrementSchema(1, 2) },
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
  elternteilKindSummary: {
    stepId: "/elternteile/#/kinder",
    arraySummary: {
      name: "elternteile#kinder",
      schema: z.array(elternteilKindSchema),
    },
  },
  elternteilKindDaten: {
    stepId: "/elternteile/#/kinder/#/daten",
    pageSchema: {
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
  elternteilKindKindSummary: {
    stepId: "/elternteile/#/kinder/#/kinder",
    arraySummary: {
      name: "elternteile#kinder#kinder",
      schema: z.array(elternteilGrandchildSchema),
    },
  },
  elternteilKindKindDaten: {
    stepId: "/elternteile/#/kinder/#/kinder/#/daten",
    pageSchema: {
      "elternteile#kinder#kinder#name": z.string(),
      "elternteile#kinder#kinder#isAlive": YesNoAnswer,
    },
  },
  gemeinsameKinderAnzahl: {
    stepId: "/gemeinsameKinderAnzahl",
    pageSchema: { gemeinsameKinderAnzahl: createNumberIncrementSchema(1) },
  },
  gemeinsameKindSummary: {
    stepId: "/gemeinsameKinder",
    arraySummary: {
      name: "gemeinsameKinder",
      schema: z.array(elternteilKindSchema),
    },
  },
  gemeinsameKindDaten: {
    stepId: "/gemeinsameKinder/#/daten",
    pageSchema: {
      "gemeinsameKinder#name": z.string(),
      "gemeinsameKinder#isAlive": YesNoAnswer,
    },
  },
  gemeinsameKindHatteKinder: {
    stepId: "/gemeinsameKinder/#/hatteKinder",
    pageSchema: { "gemeinsameKinder#hatteKinder": YesNoAnswer },
  },
  gemeinsameKindKinderAnzahl: {
    stepId: "/gemeinsameKinder/#/kinderAnzahl",
    pageSchema: {
      "gemeinsameKinder#kinderAnzahl": createNumberIncrementSchema(1),
    },
  },
  gemeinsameKindKindSummary: {
    stepId: "/gemeinsameKinder/#/kinder",
    arraySummary: {
      name: "gemeinsameKinder#kinder",
      schema: z.array(elternteilGrandchildSchema),
    },
  },
  gemeinsameKindKindDaten: {
    stepId: "/gemeinsameKinder/#/kinder/#/daten",
    pageSchema: {
      "gemeinsameKinder#kinder#name": z.string(),
      "gemeinsameKinder#kinder#isAlive": YesNoAnswer,
    },
  },
} as const;

export type NachlassErbfolgePages = typeof nachlassErbfolgePages;
