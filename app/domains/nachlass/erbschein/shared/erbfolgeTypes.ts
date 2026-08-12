type BaseAlivePerson = {
  vorname: string;
  nachname: string;
  isAlive: "yes";
};

type BaseDeceasedPersonNoKids = {
  vorname: string;
  nachname: string;
  isAlive: "no";
  hatteKinder: "no";
};

export type BaseKind =
  | BaseAlivePerson
  | BaseDeceasedPersonNoKids
  | {
      vorname: string;
      nachname: string;
      isAlive: "no";
      hatteKinder: "yes";
      kinder?: BaseKind[];
    };

type BaseElternteilKindAlive = BaseAlivePerson & {
  parentElternteilIndex?: string;
  parentKindIndex?: string;
};

type BaseElternteilKindDeceasedNoKids = BaseDeceasedPersonNoKids & {
  parentElternteilIndex?: string;
  parentKindIndex?: string;
};

// Siblings of the deceased (a parent's other children) and their descendants,
// nested up to 5 levels like the kinder line. Every node may carry a parent select:
// level-1 siblings use parentElternteilIndex ("which parent", incl. "both"), deeper
// levels use parentKindIndex ("which sibling"). Both optional so one recursive schema
// covers every depth.
export type BaseElternteilKind =
  | BaseElternteilKindAlive
  | BaseElternteilKindDeceasedNoKids
  | {
      vorname: string;
      nachname: string;
      isAlive: "no";
      hatteKinder: "yes";
      kinder?: BaseElternteilKind[];
      parentElternteilIndex?: string;
      parentKindIndex?: string;
    };

export type BaseElternteil =
  | { vorname: string; nachname: string; isAlive: "yes" }
  | { vorname: string; nachname: string; isAlive: "no"; hatteKinder: "no" }
  | {
      vorname: string;
      nachname: string;
      isAlive: "no";
      hatteKinder: "yes";
      kinder?: BaseElternteilKind[];
    };
