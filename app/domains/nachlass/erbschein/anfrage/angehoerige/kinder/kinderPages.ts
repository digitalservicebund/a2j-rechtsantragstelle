import { z } from "zod";
import {
  addressFieldsHelper,
  deathDateFieldsHelper,
  geburtsdatumFieldsHelper,
  hatteKinderFieldHelper,
  isAliveFieldHelper,
  nameFieldsHelper,
  parentKindIndexFieldHelper,
  personUnion,
} from "~/domains/nachlass/erbschein/anfrage/angehoerige/pageSchemaHelpers";
import { type Kind } from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

const kindSchema: z.ZodType<Kind> = z.lazy(() => personUnion(kindSchema));
const kinderArray = z.array(kindSchema);

const kinderLevel = (depth: number) => {
  const path = "/kinder/#".repeat(depth);
  const prefix = "kinder#".repeat(depth);
  return {
    name: {
      stepId: `/angehoerige${path}/name`,
      shouldCollapseIntoParentNavItem: true,
      pageSchema: {
        ...nameFieldsHelper(prefix),
        ...(depth >= 2 ? parentKindIndexFieldHelper(prefix, depth) : {}),
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

const kinderLevelPages = <D extends number>(depth: D) => {
  const level = kinderLevel(depth);
  return {
    [`kind${depth}Name`]: level.name,
    [`kind${depth}Geburtsdatum`]: level.geburtsdatum,
    [`kind${depth}IsAlive`]: level.isAlive,
    [`kind${depth}Address`]: level.address,
    [`kind${depth}Sterbedatum`]: level.sterbedatum,
    [`kind${depth}HatteKinder`]: level.hatteKinder,
  } as Record<`kind${D}Name`, typeof level.name> &
    Record<`kind${D}Geburtsdatum`, typeof level.geburtsdatum> &
    Record<`kind${D}IsAlive`, typeof level.isAlive> &
    Record<`kind${D}Address`, typeof level.address> &
    Record<`kind${D}Sterbedatum`, typeof level.sterbedatum> &
    Record<`kind${D}HatteKinder`, typeof level.hatteKinder>;
};

export const kinderPages = {
  hatteKinder: {
    stepId: "/angehoerige/hatte-kinder",
    pageSchema: { hatteKinder: YesNoAnswer },
  },
  kinderFehlen: {
    stepId: "/angehoerige/kinder-fehlen",
  },
  kind1Summary: {
    stepId: "/angehoerige/kinder",
    shouldCollapseIntoParentNavItem: true,
    arraySummary: {
      name: "kinder",
      schema: kinderArray,
      fieldName: "hatteKinder",
    },
  },
  ...kinderLevelPages(1),
  ...kinderLevelPages(2),
  ...kinderLevelPages(3),
  ...kinderLevelPages(4),
  ...kinderLevelPages(5),
} as const satisfies PageConfigMap;
