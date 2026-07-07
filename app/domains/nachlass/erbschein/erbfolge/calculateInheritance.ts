import { BOTH_PARENTS_VALUE } from "./buildParentOptions";
import {
  addFractions,
  HALF,
  QUARTER,
  simplify,
  splitEqually,
  subtractFromWhole,
  THREE_QUARTERS,
  WHOLE,
  type Fraction,
} from "./fraction";
import type { Elternteil, Gueterstand, Kind } from "./pages";

export type SpouseInput = {
  name: string;
  gueterstand: Gueterstand;
};

export type InheritanceInput = {
  hatteKinder?: string;
  kinder?: Kind[];
  elternteile?: Elternteil[];
  spouse?: SpouseInput;
};

export type HeirShare = {
  name: string;
  share: Fraction;
  // 0=spouse, 1=1st order (kinder/Abkömmlinge), 2=2nd order (Elternteile/Geschwister)
  order: 0 | 1 | 2;
  // 0=spouse; 1st order: 1=Kind, 2=Enkelkind, …; 2nd order: 0=Elternteil, 1=Geschwister, 2=Nichte/Neffe
  depth: number;
};

// Structural supertype of Kind, ElternteilKind, and Elternteil — the distribution
// logic only needs these fields, regardless of which family branch a person is in.
type FamilyMember = {
  name: string;
  isAlive: string;
  hatteKinder?: string;
  kinder?: FamilyMember[];
  parentKindIndex?: string;
};

function hasLivingDescendant(member: FamilyMember): boolean {
  if (member.isAlive === "yes") return true;
  if (member.hatteKinder !== "yes") return false;
  return (member.kinder ?? []).some(hasLivingDescendant);
}

type HeirEntry = { share: Fraction; depth: number };

// Distributes parentShare among kinder using the Stammesprinzip:
// - Living kinder receive their Stamm share directly.
// - Dead kinder pass their Stamm share down to their own kinder (Repräsentationsprinzip).
// - Extinct Stämme (no living descendants) are excluded; their share accretes to the rest.
// Accumulates into (and returns) accumulatedShares — a heir already present (e.g. a full
// sibling inheriting through both parents' lines) has the new share added to the existing one.
function distributeStamm(
  kinder: FamilyMember[],
  parentShare: Fraction,
  accumulatedShares = new Map<string, HeirEntry>(),
  depth = 1,
): Map<string, HeirEntry> {
  const activeKinder = kinder.filter(hasLivingDescendant);
  if (activeKinder.length === 0) return accumulatedShares;

  const stammShare = splitEqually(parentShare, activeKinder.length);

  for (const kind of activeKinder) {
    if (kind.isAlive === "yes") {
      const existing = accumulatedShares.get(kind.name);
      accumulatedShares.set(kind.name, {
        share: existing ? addFractions(existing.share, stammShare) : stammShare,
        depth,
      });
    } else if (kind.hatteKinder === "yes") {
      distributeStamm(
        kind.kinder ?? [],
        stammShare,
        accumulatedShares,
        depth + 1,
      );
    }
  }

  return accumulatedShares;
}

function isParentStammActive(elternteil: FamilyMember): boolean {
  if (elternteil.isAlive === "yes") return true;
  if (elternteil.hatteKinder !== "yes") return false;
  return (elternteil.kinder ?? []).some(hasLivingDescendant);
}

function calculate2ndOrder(
  elternteile: FamilyMember[],
  parentShare: Fraction,
): Map<string, HeirEntry> {
  const result = new Map<string, HeirEntry>();
  const activeElternteile = elternteile.filter(isParentStammActive);
  if (activeElternteile.length === 0) return result;

  const elternteilShare = splitEqually(parentShare, activeElternteile.length);

  for (const elternteil of activeElternteile) {
    if (elternteil.isAlive === "yes") {
      result.set(elternteil.name, { share: elternteilShare, depth: 0 });
    } else if (elternteil.hatteKinder === "yes") {
      distributeStamm(elternteil.kinder ?? [], elternteilShare, result);
    }
  }

  return result;
}

// Spouse share alongside 1st-order heirs (§1931 Abs.1 BGB).
// activeStaemme: number of active 1st-order lineages (only relevant for Gütertrennung).
function spouseShareAlongside1stOrder(
  gueterstand: Gueterstand,
  activeStaemme: number,
): Fraction {
  switch (gueterstand) {
    case "communityOfAcquisitions":
      // 1/4 base + 1/4 pauschaler Zugewinnausgleich (§1371 Abs.1)
      return HALF;
    case "separationOfProperty":
      // §1931 Abs.4: equal share with the children if 1 or 2 active Stämme
      return activeStaemme <= 2 ? simplify(1, activeStaemme + 1) : QUARTER;
    default:
      // communityOfProperty / other / unknown: base share only
      return QUARTER;
  }
}

// Spouse share alongside 2nd-order heirs (§1931 Abs.1 BGB): base 1/2,
// plus the pauschaler Zugewinnausgleich (§1371 Abs.1) for Zugewinngemeinschaft.
function spouseShareAlongside2ndOrder(gueterstand: Gueterstand): Fraction {
  return gueterstand === "communityOfAcquisitions" ? THREE_QUARTERS : HALF;
}

// Descendants at any depth are physically stored under the first dead member of the
// previous level; `parentKindIndex` (from the dynamic parent select) names the sibling-array
// member they actually belong to. Re-buckets every member's children by that index — falling
// back to the physical parent when unset or pointing at a missing/living member — and
// recurses first, so each deeper level is re-bucketed among its own physical sibling array.
function reassignKinderByParentIndex(members: FamilyMember[]): FamilyMember[] {
  const buckets: FamilyMember[][] = members.map(() => []);

  members.forEach((member, physicalIndex) => {
    for (const child of reassignKinderByParentIndex(member.kinder ?? [])) {
      const assigned = child.parentKindIndex ?? String(physicalIndex);
      const assignedIsDeadMember = members[Number(assigned)]?.isAlive === "no";
      const targetBucket = assignedIsDeadMember
        ? buckets[Number(assigned)]
        : buckets[physicalIndex];
      targetBucket.push(child);
    }
  });

  return members.map((member, index) =>
    member.isAlive === "no"
      ? {
          ...member,
          hatteKinder: buckets[index].length > 0 ? "yes" : "no",
          kinder: buckets[index],
        }
      : member,
  );
}

// Re-buckets each 2nd-order sibling under the parent(s) chosen via the dynamic parent
// select (`parentElternteilIndex`), which is authoritative over physical nesting.
// A "both" sibling (full sibling) is put into every parent's bucket so it represents in
// both parents' Stämme (distributeStamm accumulates the shares); siblings without a
// chosen index — or with a stale one pointing at a missing or living parent (only dead
// parents' lines distribute) — keep their physical parent.
function reassignSiblingsByParentIndex(
  elternteile: Elternteil[],
): FamilyMember[] {
  const buckets: FamilyMember[][] = elternteile.map(() => []);

  elternteile.forEach((parent, physicalIndex) => {
    const siblings = "kinder" in parent ? (parent.kinder ?? []) : [];
    for (const sibling of siblings) {
      const assigned = sibling.parentElternteilIndex ?? String(physicalIndex);
      const assignedIsDeadParent =
        elternteile[Number(assigned)]?.isAlive === "no";
      const targetBuckets =
        assigned === BOTH_PARENTS_VALUE
          ? buckets
          : [
              assignedIsDeadParent
                ? buckets[Number(assigned)]
                : buckets[physicalIndex],
            ];
      targetBuckets.forEach((bucket) => bucket.push(sibling));
    }
  });

  return elternteile.map((parent, index) =>
    parent.isAlive === "no"
      ? {
          ...parent,
          hatteKinder: buckets[index].length > 0 ? "yes" : "no",
          kinder: buckets[index],
        }
      : parent,
  );
}

export function calculateInheritance(input: InheritanceInput): HeirShare[] {
  const kinder = reassignKinderByParentIndex(input.kinder ?? []);
  const elternteile = reassignSiblingsByParentIndex(input.elternteile ?? []);

  const has1stOrder =
    input.hatteKinder === "yes" && kinder.some(hasLivingDescendant);
  const has2ndOrder = !has1stOrder && elternteile.some(isParentStammActive);

  const result: HeirShare[] = [];
  let remainingShare = WHOLE;

  if (input.spouse) {
    const spouseShare = has1stOrder
      ? spouseShareAlongside1stOrder(
          input.spouse.gueterstand,
          kinder.filter(hasLivingDescendant).length,
        )
      : has2ndOrder
        ? spouseShareAlongside2ndOrder(input.spouse.gueterstand)
        : WHOLE;
    remainingShare = subtractFromWhole(spouseShare);
    result.push({
      name: input.spouse.name,
      share: spouseShare,
      order: 0,
      depth: 0,
    });
  }

  const heirMap = has1stOrder
    ? distributeStamm(kinder, remainingShare)
    : has2ndOrder
      ? calculate2ndOrder(elternteile, remainingShare)
      : new Map<string, HeirEntry>();
  const heirOrder = has1stOrder ? 1 : 2;

  for (const [name, entry] of heirMap.entries()) {
    result.push({ name, order: heirOrder, ...entry });
  }

  return result;
}
