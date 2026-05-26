import { z } from "zod";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { createNumberIncrementSchema } from "~/services/validation/numberIncrement";

type Kind =
  | { name: string; isAlive: "no"; hatteKinder: "yes" | "no" }
  | { name: string; isAlive: "yes"; kinder: Kind[]; hatteKinder: "yes" | "no" };

const kindNameSchema = z.string();

const kindSchema: z.ZodType<Kind> = z.lazy(() =>
  z.union([
    z.object({ name: kindNameSchema, isAlive: z.literal("no"), hatteKinder: YesNoAnswer }),
    z.object({ name: kindNameSchema, isAlive: z.literal("yes"), kinder: z.array(kindSchema), hatteKinder: YesNoAnswer }),
  ]),
);

const kinderArray = z.array(kindSchema);

const kindDatenSchema = (prefix: string) => ({
  [`${prefix}name`]: kindNameSchema,
  [`${prefix}isAlive`]: YesNoAnswer,
});

export const nachlassErbfolgePages = {
  start: { stepId: "/start" },
  verstorbenePerson: {
    stepId: "/verstorbenePerson",
    pageSchema: { name: stringRequiredSchema },
  },
  familienstand: {
    stepId: "/familienstand",
    pageSchema: {
      familienstand: z.enum(["ledig", "verheiratet", "geschieden", "verwitwet"]),
    },
  },
  ehepartner: {
    stepId: "/ehepartner",
    pageSchema: { ehepartnerName: stringRequiredSchema },
  },
  kinder: {
    stepId: "/hatteKinder",
    pageSchema: { hatteKinder: YesNoAnswer },
  },
  kinderAnzahl: {
    stepId: "/kinderAnzahl",
    pageSchema: { kinderAnzahl: createNumberIncrementSchema(1) },
  },
  kind1Enkelkinder: {
    stepId: "/kinder/#/enkelkinder",
    pageSchema: { "kinder#hatteKinder": YesNoAnswer },
  },
  kind1EnkelkinderAnzahl: {
    stepId: "/kinder/#/enkelkinderAnzahl",
    pageSchema: { "kinder#enkelkinderAnzahl": createNumberIncrementSchema(1) },
  },
  kind1Summary: {
    stepId: "/kinder",
    arraySummary: { name: "kinder", schema: kinderArray },
  },
  kind1Daten: {
    stepId: "/kinder/#/daten",
    pageSchema: kindDatenSchema("kinder#"),
  },
  kind2Summary: {
    stepId: "/kinder/#/kinder",
    arraySummary: { name: "kinder#kinder", schema: kinderArray },
  },
  kind2Daten: {
    stepId: "/kinder/#/kinder/#/daten",
    pageSchema: kindDatenSchema("kinder#kinder#"),
  },
  kind3Summary: {
    stepId: "/kinder/#/kinder/#/kinder",
    arraySummary: { name: "kinder#kinder#kinder", schema: kinderArray },
  },
  kind3Daten: {
    stepId: "/kinder/#/kinder/#/kinder/#/daten",
    pageSchema: kindDatenSchema("kinder#kinder#kinder#"),
  },
  kind4Summary: {
    stepId: "/kinder/#/kinder/#/kinder/#/kinder",
    arraySummary: { name: "kinder#kinder#kinder#kinder", schema: kinderArray },
  },
  kind4Daten: {
    stepId: "/kinder/#/kinder/#/kinder/#/kinder/#/daten",
    pageSchema: kindDatenSchema("kinder#kinder#kinder#kinder#"),
  },
  kind5Summary: {
    stepId: "/kinder/#/kinder/#/kinder/#/kinder/#/kinder",
    arraySummary: { name: "kinder#kinder#kinder#kinder#kinder", schema: kinderArray },
  },
  kind5Daten: {
    stepId: "/kinder/#/kinder/#/kinder/#/kinder/#/kinder/#/daten",
    pageSchema: kindDatenSchema("kinder#kinder#kinder#kinder#kinder#"),
  },
} as const;

export type NachlassErbfolgePages = typeof nachlassErbfolgePages;
