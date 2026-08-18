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
