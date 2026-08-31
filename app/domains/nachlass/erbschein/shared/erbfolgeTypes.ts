import { z } from "zod";
import {
  type deceasedPersonNoKidsSchema,
  type alivePersonSchema,
  personUnion,
} from "~/domains/nachlass/erbschein/anfrage/angehoerige/pageSchemaHelpers";
import { type NachlassErbscheinErbfolgeUserData } from "~/domains/nachlass/erbschein/erbfolge/userData";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

// #region Base Erbfolge types, used in the Erbfolge Vorabcheck.
type BaseAlivePerson = Pick<
  AlivePerson,
  "vorname" | "nachname" | "isAlive" | "parentKindIndex"
>;

type BaseDeceasedPersonNoKids = Pick<
  DeceasedPersonNoKids,
  "vorname" | "nachname" | "isAlive" | "hatteKinder" | "parentKindIndex"
>;

export type BaseDeceasedPersonWithKids = Pick<
  DeceasedPersonWithKids,
  "vorname" | "nachname" | "isAlive" | "hatteKinder" | "parentKindIndex"
> & {
  kinder?: BaseKind[];
};

export type BaseKind =
  BaseAlivePerson | BaseDeceasedPersonNoKids | BaseDeceasedPersonWithKids;

type BaseElternteilKindAlive = Pick<
  ElternteilKindAlive,
  | "vorname"
  | "nachname"
  | "isAlive"
  | "parentElternteilIndex"
  | "parentKindIndex"
>;

type BaseElternteilKindDeceasedNoKids = Pick<
  ElternteilKindDeceasedNoKids,
  | "vorname"
  | "nachname"
  | "isAlive"
  | "hatteKinder"
  | "parentElternteilIndex"
  | "parentKindIndex"
>;

type BaseElternteilKindDeceasedWithKids = Pick<
  ElternteilKindDeceasedWithKids,
  | "vorname"
  | "nachname"
  | "isAlive"
  | "hatteKinder"
  | "parentElternteilIndex"
  | "parentKindIndex"
> & {
  kinder?: BaseElternteilKind[];
};

// Siblings of the deceased (a parent's other children) and their descendants,
// nested up to 5 levels like the kinder line. Every node may carry a parent select:
// level-1 siblings use parentElternteilIndex ("which parent", incl. "both"), deeper
// levels use parentKindIndex ("which sibling"). Both optional so one recursive schema
// covers every depth.
export type BaseElternteilKind =
  | BaseElternteilKindAlive
  | BaseElternteilKindDeceasedNoKids
  | BaseElternteilKindDeceasedWithKids;

export type BaseElternteil =
  | BaseAlivePerson
  | BaseDeceasedPersonNoKids
  | (Omit<BaseDeceasedPersonWithKids, "kinder"> & {
      kinder?: BaseElternteilKind[];
    });
// #endregion

// #region Extended (full) Erbfolge types, for use in Erbscheinsantrag and summary components.
type AlivePerson = z.infer<typeof alivePersonSchema> & {
  parentKindIndex?: string;
};
type DeceasedPersonNoKids = z.infer<typeof deceasedPersonNoKidsSchema> & {
  parentKindIndex?: string;
};
type DeceasedPersonWithKids = Omit<DeceasedPersonNoKids, "hatteKinder"> & {
  hatteKinder: "yes";
  parentKindIndex?: string;
  kinder?: Kind[];
};
export type Kind = AlivePerson | DeceasedPersonNoKids | DeceasedPersonWithKids;

const kindSchema: z.ZodType<Kind> = z.lazy(() => personUnion(kindSchema));

type ElternteilKindAlive = AlivePerson & {
  parentElternteilIndex?: string;
};

type ElternteilKindDeceasedNoKids = DeceasedPersonNoKids & {
  parentElternteilIndex?: string;
};

type ElternteilKindDeceasedWithKids = Omit<DeceasedPersonWithKids, "kinder"> & {
  parentElternteilIndex?: string;
  kinder?: ElternteilKind[];
};

// Siblings of the deceased (a parent's other children) and their descendants,
// nested up to 5 levels like the kinder line. Every node may carry a parent select:
// level-1 siblings use parentElternteilIndex ("which parent", incl. "both"), deeper
// levels use parentKindIndex ("which sibling"). Both optional so one recursive schema
// covers every depth.
export type ElternteilKind =
  | ElternteilKindAlive
  | ElternteilKindDeceasedNoKids
  | ElternteilKindDeceasedWithKids;

export type Elternteil =
  | AlivePerson
  | DeceasedPersonNoKids
  | (Omit<DeceasedPersonWithKids, "kinder"> & {
      kinder?: ElternteilKind[];
    });

// #endregion

export type ErbfolgeData =
  NachlassErbscheinErbfolgeUserData | NachlassErbscheinAnfrageUserData;
