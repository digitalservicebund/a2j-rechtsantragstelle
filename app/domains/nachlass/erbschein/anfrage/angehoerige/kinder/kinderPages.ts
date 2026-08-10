import { z } from "zod";
import {
  addressFieldsHelper,
  type AlivePerson,
  deathDateFieldsHelper,
  type DeceasedPersonNoKids,
  geburtsdatumFieldsHelper,
  hatteKinderFieldHelper,
  isAliveFieldHelper,
  nameFieldsHelper,
  parentKindIndexFieldHelper,
  personUnion,
} from "~/domains/nachlass/erbschein/anfrage/angehoerige/pageSchemaHelpers";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

type Kind =
  | AlivePerson
  | DeceasedPersonNoKids
  | {
      vorname: string;
      nachname: string;
      geburtsname?: string;
      geburtsdatum: {
        day: string;
        month: string;
        year: string;
      };
      geburtsort: string;
      isAlive: "no";
      hatteKinder: "yes";
      kinder?: Kind[];
      sterbedatum: {
        day: string;
        month: string;
        year: string;
      };
      sterbeort: string;
    };

const kindSchema: z.ZodType<Kind> = z.lazy(() => personUnion(kindSchema));
const kinderArray = z.array(kindSchema);

const kinderLevel = <D extends 1 | 2 | 3 | 4 | 5, P extends string>(
  depth: D,
  prefix: P,
) => {
  const path = "/kinder/#".repeat(depth);
  return {
    name: {
      stepId: `/angehoerige${path}/name` as const,
      pageSchema: nameFieldsHelper(prefix),
    },
    geburtsdatum: {
      stepId: `/angehoerige${path}/geburtsdatum` as const,
      pageSchema: geburtsdatumFieldsHelper(prefix),
    },
    provenance: {
      stepId: `/angehoerige${path}/wessen-kind` as const,
      pageSchema: parentKindIndexFieldHelper(prefix, depth),
    },
    isAlive: {
      stepId: `/angehoerige${path}/lebend` as const,
      pageSchema: isAliveFieldHelper(prefix),
    },
    address: {
      stepId: `/angehoerige${path}/adresse` as const,
      pageSchema: addressFieldsHelper(prefix),
    },
    sterbedatum: {
      stepId: `/angehoerige${path}/sterbedatum` as const,
      pageSchema: deathDateFieldsHelper(prefix),
    },
    hatteKinder: {
      stepId: `/angehoerige${path}/hatte-kinder` as const,
      pageSchema: hatteKinderFieldHelper(prefix),
    },
  };
};

const kinderLevelPages = <D extends 1 | 2 | 3 | 4 | 5, P extends string>(
  depth: D,
  prefix: P,
) => {
  const level = kinderLevel(depth, prefix);
  return {
    [`kind${depth}Name`]: level.name,
    [`kind${depth}Geburtsdatum`]: level.geburtsdatum,
    [`kind${depth}Provenance`]: level.provenance,
    [`kind${depth}IsAlive`]: level.isAlive,
    [`kind${depth}Address`]: level.address,
    [`kind${depth}Sterbedatum`]: level.sterbedatum,
    [`kind${depth}HatteKinder`]: level.hatteKinder,
  } as Record<`kind${D}Name`, typeof level.name> &
    Record<`kind${D}Geburtsdatum`, typeof level.geburtsdatum> &
    Record<`kind${D}Provenance`, typeof level.provenance> &
    Record<`kind${D}IsAlive`, typeof level.isAlive> &
    Record<`kind${D}Address`, typeof level.address> &
    Record<`kind${D}Sterbedatum`, typeof level.sterbedatum> &
    Record<`kind${D}HatteKinder`, typeof level.hatteKinder>;
};

export const kinderPages = {
  kinder: {
    stepId: "/angehoerige/hatte-kinder",
    pageSchema: { hatteKinder: YesNoAnswer },
  },
  kind1Summary: {
    stepId: "/angehoerige/kinder",
    arraySummary: { name: "kinder", schema: kinderArray },
  },
  ...kinderLevelPages(1, "kinder#" as const),
} as const;
