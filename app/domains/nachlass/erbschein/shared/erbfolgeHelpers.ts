// Returns true if a kind (and all their descendants) have no living heirs.

import { type PersonItem } from "~/domains/nachlass/erbschein/shared/components/types";

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
