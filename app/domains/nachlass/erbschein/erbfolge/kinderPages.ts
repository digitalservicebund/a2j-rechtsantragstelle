import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  datenFields,
  hatteKinderField,
  parentKindIndexSchema,
  personUnion,
} from "./pageSchemaHelpers";

export type Kind =
  | { name: string; isAlive: "yes" }
  | { name: string; isAlive: "no"; hatteKinder: "no" }
  | { name: string; isAlive: "no"; hatteKinder: "yes"; kinder?: Kind[] };

const kindSchema: z.ZodType<Kind> = z.lazy(() => personUnion(kindSchema));

const kinderArray = z.array(kindSchema);

// The two page-registry entries for one kinder depth. Every level repeats the
// same daten / hatteKinder pages, differing only by nesting depth.
// Levels >= 2 also carry the dynamic parent select (rendered after name/isAlive).
const kinderLevel = (depth: number) => {
  const path = "/kinder/#".repeat(depth);
  const prefix = "kinder#".repeat(depth);
  return {
    daten: {
      stepId: `${path}/daten`,
      pageSchema: {
        ...datenFields(prefix),
        ...(depth >= 2
          ? { [`${prefix}parentKindIndex`]: parentKindIndexSchema }
          : {}),
      },
    },
    hatteKinder: {
      stepId: `${path}/hatteKinder`,
      pageSchema: hatteKinderField(prefix),
    },
  };
};

// Wraps a level into registry entries keyed kind{depth}Daten / …HatteKinder.
// The template-literal key types keep those keys statically known, so transition
// targets in kinderFlowConfig.ts stay type-checked.
const kinderLevelPages = <Depth extends number>(depth: Depth) => {
  const { daten, hatteKinder } = kinderLevel(depth);
  return {
    [`kind${depth}Daten`]: daten,
    [`kind${depth}HatteKinder`]: hatteKinder,
  } as Record<`kind${Depth}Daten`, typeof daten> &
    Record<`kind${Depth}HatteKinder`, typeof hatteKinder>;
};

export const kinderPages = {
  kinder: {
    stepId: "/hatteKinder",
    pageSchema: { hatteKinder: YesNoAnswer },
  },
  kind1Summary: {
    stepId: "/kinder",
    arraySummary: { name: "kinder", schema: kinderArray },
  },
  ...kinderLevelPages(1),
  ...kinderLevelPages(2),
  ...kinderLevelPages(3),
  ...kinderLevelPages(4),
  // Deepest level is terminal: no hatteKinder follow-up.
  kind5Daten: kinderLevel(5).daten,
} as const;
