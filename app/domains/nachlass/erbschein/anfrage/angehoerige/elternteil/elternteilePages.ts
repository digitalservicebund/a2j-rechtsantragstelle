import { z } from "zod";
import {
  addressFieldsHelper,
  deathDateFieldsHelper,
  geburtsdatumFieldsHelper,
  hatteKinderFieldHelper,
  isAliveFieldHelper,
  nameFieldsHelper,
  personUnion,
} from "~/domains/nachlass/erbschein/anfrage/angehoerige/pageSchemaHelpers";
import {
  parentElternteilIndexSchema,
  parentKindIndexSchema,
} from "~/domains/nachlass/erbschein/shared/erbfolgeSchemas";
import {
  type Elternteil,
  type ElternteilKind,
} from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";

const elternteilKindSchema: z.ZodType<ElternteilKind> = z.lazy(() =>
  personUnion(elternteilKindSchema),
);

const elternteilSchema: z.ZodType<Elternteil> = personUnion(
  z.intersection(
    elternteilKindSchema,
    z.object({
      parentElternteilIndex: z.string().optional(),
      parentKindIndex: z.string().optional(),
    }),
  ),
);

const elternteileArray = z.array(elternteilSchema);

// One elternteil-descendant depth, rooted at the elternteile array. Level 1 (the
// deceased's sibling) carries the parentElternteilIndex select (which parent, rendered
// first as before); deeper levels carry parentKindIndex (which sibling, rendered last
// like the kinder line).
const elternteilKinderLevel = (depth: number) => {
  const path = `/elternteile/#${"/kinder/#".repeat(depth)}`;
  const prefix = `elternteile#${"kinder#".repeat(depth)}`;
  return {
    name: {
      stepId: `/angehoerige${path}/name`,
      shouldCollapseIntoParentNavItem: true,
      pageSchema: {
        ...nameFieldsHelper(prefix),
        ...(depth === 1
          ? {
              [`${prefix}parentElternteilIndex`]: parentElternteilIndexSchema,
            }
          : {
              [`${prefix}parentKindIndex`]: parentKindIndexSchema,
            }),
      },
    },
    geburtsdatum: {
      stepId: `/angehoerige${path}/geburtsdatum`,
      shouldCollapseIntoParentNavItem: true,
      pageSchema: geburtsdatumFieldsHelper(prefix),
    },
    isAlive: {
      stepId: `/angehoerige${path}/lebend`,
      shouldCollapseIntoParentNavItem: true,
      pageSchema: isAliveFieldHelper(prefix),
    },
    address: {
      stepId: `/angehoerige${path}/adresse`,
      shouldCollapseIntoParentNavItem: true,
      pageSchema: addressFieldsHelper(prefix),
    },
    sterbedatum: {
      stepId: `/angehoerige${path}/sterbedatum`,
      shouldCollapseIntoParentNavItem: true,
      pageSchema: deathDateFieldsHelper(prefix),
    },
    hatteKinder: {
      stepId: `/angehoerige${path}/hatte-kinder`,
      shouldCollapseIntoParentNavItem: true,
      pageSchema: hatteKinderFieldHelper(prefix),
    },
  } as const satisfies PageConfigMap;
};

// Wraps a level into registry entries keyed elternteilKind{depth}Daten / …HatteKinder.
// Template-literal key types keep the keys statically known so transition
// targets in elternteilFlowConfig.ts stay type-checked.
const elternteilKinderLevelPages = <Depth extends number>(depth: Depth) => {
  const { name, geburtsdatum, isAlive, address, sterbedatum, hatteKinder } =
    elternteilKinderLevel(depth);
  return {
    [`elternteilKind${depth}Name`]: name,
    [`elternteilKind${depth}Geburtsdatum`]: geburtsdatum,
    [`elternteilKind${depth}IsAlive`]: isAlive,
    [`elternteilKind${depth}Address`]: address,
    [`elternteilKind${depth}Sterbedatum`]: sterbedatum,
    [`elternteilKind${depth}HatteKinder`]: hatteKinder,
  } as Record<`elternteilKind${Depth}Name`, typeof name> &
    Record<`elternteilKind${Depth}Geburtsdatum`, typeof geburtsdatum> &
    Record<`elternteilKind${Depth}IsAlive`, typeof isAlive> &
    Record<`elternteilKind${Depth}Address`, typeof address> &
    Record<`elternteilKind${Depth}Sterbedatum`, typeof sterbedatum> &
    Record<`elternteilKind${Depth}HatteKinder`, typeof hatteKinder>;
};

export const elternteilePages = {
  elternteilSummary: {
    stepId: "/angehoerige/elternteile/uebersicht",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: { name: "elternteile", schema: elternteileArray },
  },
  elternteileFehlen: {
    stepId: "/angehoerige/elternteile-fehlen",
  },
  elternteilName: {
    stepId: `/angehoerige/elternteile/#/name`,
    shouldCollapseIntoParentNavItem: true,
    pageSchema: nameFieldsHelper("elternteile#"),
  },
  elternteilGeburtsdatum: {
    stepId: `/angehoerige/elternteile/#/geburtsdatum`,
    shouldCollapseIntoParentNavItem: true,
    pageSchema: geburtsdatumFieldsHelper("elternteile#"),
  },
  elternteilIsAlive: {
    stepId: `/angehoerige/elternteile/#/lebend`,
    shouldCollapseIntoParentNavItem: true,
    pageSchema: isAliveFieldHelper("elternteile#"),
  },
  elternteilAddress: {
    stepId: `/angehoerige/elternteile/#/adresse`,
    shouldCollapseIntoParentNavItem: true,
    pageSchema: addressFieldsHelper("elternteile#"),
  },
  elternteilSterbedatum: {
    stepId: `/angehoerige/elternteile/#/sterbedatum`,
    shouldCollapseIntoParentNavItem: true,
    pageSchema: deathDateFieldsHelper("elternteile#"),
  },
  elternteilHatteKinder: {
    stepId: `/angehoerige/elternteile/#/hatte-kinder`,
    shouldCollapseIntoParentNavItem: true,
    pageSchema: hatteKinderFieldHelper("elternteile#"),
  },
  ...elternteilKinderLevelPages(1),
  ...elternteilKinderLevelPages(2),
  ...elternteilKinderLevelPages(3),
  ...elternteilKinderLevelPages(4),
  ...elternteilKinderLevelPages(5),
} as const;
