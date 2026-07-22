import { z } from "zod";
import {
  datenFields,
  hatteKinderField,
  parentElternteilIndexSchema,
  parentKindIndexSchema,
  personUnion,
} from "./pageSchemaHelpers";

// Siblings of the deceased (a parent's other children) and their descendants,
// nested up to 5 levels like the kinder line. Every node may carry a parent select:
// level-1 siblings use parentElternteilIndex ("which parent", incl. "both"), deeper
// levels use parentKindIndex ("which sibling"). Both optional so one recursive schema
// covers every depth.
type ElternteilKind =
  | {
      name: string;
      isAlive: "yes";
      parentElternteilIndex?: string;
      parentKindIndex?: string;
    }
  | {
      name: string;
      isAlive: "no";
      hatteKinder: "no";
      parentElternteilIndex?: string;
      parentKindIndex?: string;
    }
  | {
      name: string;
      isAlive: "no";
      hatteKinder: "yes";
      kinder?: ElternteilKind[];
      parentElternteilIndex?: string;
      parentKindIndex?: string;
    };

const elternteilKindSchema: z.ZodType<ElternteilKind> = z.lazy(() =>
  personUnion(elternteilKindSchema, {
    parentElternteilIndex: z.string().optional(),
    parentKindIndex: z.string().optional(),
  }),
);

export type Elternteil =
  | { name: string; isAlive: "yes" }
  | { name: string; isAlive: "no"; hatteKinder: "no" }
  | {
      name: string;
      isAlive: "no";
      hatteKinder: "yes";
      kinder?: ElternteilKind[];
    };

const elternteilSchema: z.ZodType<Elternteil> = personUnion(
  elternteilKindSchema,
  {},
);

const elternteileArray = z.array(elternteilSchema);

// One elternteil-descendant depth, rooted at the elternteile array. Level 1 (the
// deceased's sibling) carries the parentElternteilIndex select (which parent, rendered
// first as before); deeper levels carry parentKindIndex (which sibling, rendered last
// like the kinder line).
const elternteilKinderLevel = (depth: number) => {
  const path = `/elternteile/#${"/kinder/#".repeat(depth)}`;
  const prefix = `elternteile#${"kinder#".repeat(depth)}`;
  const datenSchema =
    depth === 1
      ? {
          [`${prefix}parentElternteilIndex`]: parentElternteilIndexSchema,
          ...datenFields(prefix),
        }
      : {
          ...datenFields(prefix),
          [`${prefix}parentKindIndex`]: parentKindIndexSchema,
        };
  return {
    daten: { stepId: `${path}/daten`, pageSchema: datenSchema },
    hatteKinder: {
      stepId: `${path}/hatteKinder`,
      pageSchema: hatteKinderField(prefix),
    },
  };
};

// Wraps a level into registry entries keyed elternteilKind{depth}Daten / …HatteKinder.
// Template-literal key types keep the keys statically known so transition
// targets in elternteilFlowConfig.ts stay type-checked.
const elternteilKinderLevelPages = <Depth extends number>(depth: Depth) => {
  const { daten, hatteKinder } = elternteilKinderLevel(depth);
  return {
    [`elternteilKind${depth}Daten`]: daten,
    [`elternteilKind${depth}HatteKinder`]: hatteKinder,
  } as Record<`elternteilKind${Depth}Daten`, typeof daten> &
    Record<`elternteilKind${Depth}HatteKinder`, typeof hatteKinder>;
};

export const elternteilePages = {
  elternteilSummary: {
    stepId: "/elternteile",
    arraySummary: { name: "elternteile", schema: elternteileArray },
  },
  elternteilDaten: {
    stepId: "/elternteile/#/daten",
    pageSchema: datenFields("elternteile#"),
  },
  elternteilHatteKinder: {
    stepId: "/elternteile/#/hatteKinder",
    pageSchema: hatteKinderField("elternteile#"),
  },
  ...elternteilKinderLevelPages(1),
  ...elternteilKinderLevelPages(2),
  ...elternteilKinderLevelPages(3),
  ...elternteilKinderLevelPages(4),
  ...elternteilKinderLevelPages(5),
} as const;
