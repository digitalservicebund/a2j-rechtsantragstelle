import { BOTH_PARENTS_VALUE } from "./buildParentOptions";

type FamilyMember = {
  name: string;
  isAlive: string;
  hatteKinder?: string;
  kinder?: FamilyMember[];
  parentKindIndex?: string;
  parentElternteilIndex?: string;
};

// Descendants are physically stored under the first dead member of the
// previous level (a constraint of the array-add flow, which only has one
// entry point per depth); parentKindIndex names the sibling they actually
// belong to. Mirrors calculateInheritance's reassignKinderByParentIndex, but
// without touching hatteKinder — that field must stay as the user answered
// it so a genuinely missing entry doesn't get silently masked as "no kids".
function bucketKinderByParentIndex(members: FamilyMember[]): FamilyMember[][] {
  const buckets: FamilyMember[][] = members.map(() => []);
  members.forEach((member, physicalIndex) => {
    for (const child of member.kinder ?? []) {
      const assigned = child.parentKindIndex ?? String(physicalIndex);
      const assignedIsDeadMember = members[Number(assigned)]?.isAlive === "no";
      const targetBucket = assignedIsDeadMember
        ? buckets[Number(assigned)]
        : buckets[physicalIndex];
      targetBucket.push(child);
    }
  });
  return buckets;
}

// Names of everyone who is dead, stated to have had kids (hatteKinder: "yes"),
// but has no kinder actually attributed to them once parentKindIndex
// reassignment is accounted for. Their legal heirs (in the 1st order) are
// unknown, so the flow must not proceed past them until the user fills them in.
export function collectMissingChildrenNames(members: FamilyMember[]): string[] {
  const buckets = bucketKinderByParentIndex(members);
  return members.flatMap((member, index) => {
    if (member.isAlive === "yes") return [];
    if (member.hatteKinder !== "yes") return [];
    const assignedKinder = buckets[index];
    if (assignedKinder.length === 0) return [member.name];
    return collectMissingChildrenNames(assignedKinder);
  });
}

// Same idea as bucketKinderByParentIndex, but for 2nd-order siblings keyed by
// parentElternteilIndex — a "both" sibling counts toward both parents' buckets.
function bucketSiblingsByParentElternteilIndex(
  elternteile: FamilyMember[],
): FamilyMember[][] {
  const buckets: FamilyMember[][] = elternteile.map(() => []);
  elternteile.forEach((parent, physicalIndex) => {
    for (const sibling of parent.kinder ?? []) {
      const assigned = sibling.parentElternteilIndex ?? String(physicalIndex);
      if (assigned === BOTH_PARENTS_VALUE) {
        buckets.forEach((bucket) => bucket.push(sibling));
        continue;
      }
      const assignedIsDeadParent =
        elternteile[Number(assigned)]?.isAlive === "no";
      const targetBucket = assignedIsDeadParent
        ? buckets[Number(assigned)]
        : buckets[physicalIndex];
      targetBucket.push(sibling);
    }
  });
  return buckets;
}

// Elternteile-tree equivalent of collectMissingChildrenNames: level-1 siblings
// are reassigned by parentElternteilIndex, then deeper levels (nieces/nephews
// and beyond) reuse the same parentKindIndex-based reassignment as the kinder tree.
export function collectMissingChildrenNamesForElternteile(
  elternteile: FamilyMember[],
): string[] {
  const buckets = bucketSiblingsByParentElternteilIndex(elternteile);
  const names = elternteile.flatMap((parent, index) => {
    if (parent.isAlive === "yes") return [];
    if (parent.hatteKinder !== "yes") return [];
    const assignedSiblings = buckets[index];
    if (assignedSiblings.length === 0) return [parent.name];
    return collectMissingChildrenNames(assignedSiblings);
  });
  // A "both" sibling is counted in both parents' buckets, so a missing
  // grandchild of theirs can otherwise turn up twice.
  return [...new Set(names)];
}
