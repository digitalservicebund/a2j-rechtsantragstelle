import { type PersonItem } from "~/domains/nachlass/erbschein/shared/components/types";
import {
  type Elternteil,
  type ElternteilKind,
  type Kind,
  type ErbfolgeData,
} from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";
import {
  type SummaryPerson,
  migrationDataIsEmpty,
  hasMissingDate,
  hasMissingAddress,
} from "./components/hasMissingData";

export const MAX_SUPPORTED_DESCENDANT_DEPTH = 5;

// A living kind or any living grandkid/great-grandkid means this returns false.
export function allDescendantsDead(kind: {
  isAlive?: string;
  hatteKinder?: string;
  kinder?: Array<typeof kind>;
}): boolean {
  if (kind.isAlive === "yes") return false;
  if (kind.hatteKinder !== "yes") return true;
  return (kind.kinder ?? []).every(allDescendantsDead);
}

/**
 * Guard to ensure that a given child of a given depth is reachable.
 */
export const getEligibleKind = (
  kinder: PersonItem[] | undefined,
  arrayIndexes: number[] | undefined,
  depth: number,
): PersonItem | undefined => {
  if (!kinder || !arrayIndexes || arrayIndexes.length < depth) return;

  let siblings = kinder;
  let kind;

  for (let level = 0; level < depth; level++) {
    kind = siblings[arrayIndexes[level]];
    if (!kind) return;

    if (level < depth - 1) {
      if (kind.isAlive !== "no" || kind.hatteKinder !== "yes") return;
      siblings = kind.kinder ?? [];
    }
  }

  return kind;
};

type DescendantNode = {
  isAlive?: string;
  hatteKinder?: string;
  kinder?: DescendantNode[];
};

export const isDead = (node: DescendantNode | null) => node?.isAlive === "no";
export const isDeadWithKinder = (node: DescendantNode | null) =>
  node?.isAlive === "no" && node?.hatteKinder === "yes";

// Walk elternteile[i0].kinder[i1]…kinder[iDepth] and return the node at `depth`
// (0 = the parent itself, 1 = a sibling, …) only if every ancestor is a dead
// parent-with-kids; otherwise null. arrayIndexes = [elternteilIndex, kind1Index, …].
export function elternteilKindAt(
  elternteile: DescendantNode[] | undefined,
  arrayIndexes: number[] | undefined,
  depth: number,
): DescendantNode | null {
  if (!elternteile || !arrayIndexes || arrayIndexes.length < depth + 1)
    return null;
  let node: DescendantNode | undefined = elternteile[arrayIndexes[0]];
  for (let level = 1; level <= depth; level++) {
    if (node?.isAlive !== "no" || node.hatteKinder !== "yes") return null;
    node = node.kinder?.[arrayIndexes[level]];
  }
  return node ?? null;
}

// At the deepest supported depth we only need further generations if that
// person also had children (unsupported depth 6+). A depth-5 person who died
// without children is a fully known, terminal branch.
function hasDeadMemberAtDepth(
  members: PersonItem[],
  targetDepth: number,
  currentDepth = 1,
): boolean {
  return members.some(
    (member) =>
      (currentDepth === targetDepth &&
        member.isAlive === "no" &&
        member.hatteKinder === "yes") ||
      (currentDepth < targetDepth &&
        hasDeadMemberAtDepth(
          "kinder" in member ? (member.kinder ?? []) : [],
          targetDepth,
          currentDepth + 1,
        )),
  );
}

// Kept separate from elternteileRequireFurtherGenerations (rather than one combined
// check) so a depth limit hit in one branch doesn't gate reachability of the other
// branch's summary page: both hub pages (kind1Summary, elternteilSummary) use this
// guard, and a single combined check would make BOTH summaries unreachable once
// either branch trips the limit, blocking the user from going back to fix it.
export function kinderRequireFurtherGenerations(input: ErbfolgeData): boolean {
  return hasDeadMemberAtDepth(
    input.kinder ?? [],
    MAX_SUPPORTED_DESCENDANT_DEPTH,
  );
}

export function elternteileRequireFurtherGenerations(
  input: ErbfolgeData,
): boolean {
  return (input.elternteile ?? []).some((parent) =>
    hasDeadMemberAtDepth(
      "kinder" in parent ? (parent.kinder ?? []) : [],
      MAX_SUPPORTED_DESCENDANT_DEPTH,
    ),
  );
}

const hasMissingPersonData = (person: SummaryPerson): boolean => {
  if (
    migrationDataIsEmpty(person.vorname) ||
    migrationDataIsEmpty(person.nachname)
  ) {
    return true;
  }

  if (
    "geburtsdatum" in person &&
    (hasMissingDate(person.geburtsdatum) ||
      migrationDataIsEmpty(person.geburtsort))
  ) {
    return true;
  }

  if (hasMissingAddress(person)) {
    return true;
  }

  if (
    person.isAlive === "no" &&
    "sterbedatum" in person &&
    (hasMissingDate(person.sterbedatum) ||
      migrationDataIsEmpty(person.sterbeort) ||
      migrationDataIsEmpty(person.hatteKinder))
  ) {
    return true;
  }

  return false;
};

type PersonWithChildren = Kind | Elternteil | ElternteilKind;

export const hasMissingDataInFamily = (
  people: PersonWithChildren[] | undefined,
): boolean => {
  if (!people) {
    return false;
  }

  return people.some((person) => {
    if (hasMissingPersonData(person)) {
      return true;
    }

    if ("kinder" in person && person.kinder) {
      return hasMissingDataInFamily(person.kinder);
    }

    return false;
  });
};
