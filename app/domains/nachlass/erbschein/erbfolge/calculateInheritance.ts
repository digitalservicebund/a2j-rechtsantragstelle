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

const MAX_SUPPORTED_DESCENDANT_DEPTH = 5;

function hasLivingDescendant(member: FamilyMember): boolean {
  if (member.isAlive === "yes") return true;
  if (member.hatteKinder !== "yes") return false;
  return (member.kinder ?? []).some(hasLivingDescendant);
}

// At the deepest supported depth we only need further generations if that
// person also had children (unsupported depth 6+). A depth-5 person who died
// without children is a fully known, terminal branch.
function hasDeadMemberAtDepth(
  members: FamilyMember[],
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
          member.kinder ?? [],
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
export function kinderRequireFurtherGenerations(
  input: InheritanceInput,
): boolean {
  return hasDeadMemberAtDepth(
    input.kinder ?? [],
    MAX_SUPPORTED_DESCENDANT_DEPTH,
  );
}

export function elternteileRequireFurtherGenerations(
  input: InheritanceInput,
): boolean {
  return (input.elternteile ?? []).some((parent) =>
    hasDeadMemberAtDepth(
      "kinder" in parent ? (parent.kinder ?? []) : [],
      MAX_SUPPORTED_DESCENDANT_DEPTH,
    ),
  );
}

export function hasNoFirstOrSecondOrderHeirs(input: InheritanceInput): boolean {
  return calculateInheritance(input).every((heir) => heir.order === 0);
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

// The spouse takes their cut first: alongside living 1st-order Stämme, alongside an
// active 2nd order, or the whole estate when they are the only heir.
function spouseShare(
  gueterstand: Gueterstand,
  living1stOrderStaemme: number,
  has2ndOrder: boolean,
): Fraction {
  if (living1stOrderStaemme > 0) {
    return spouseShareAlongside1stOrder(gueterstand, living1stOrderStaemme);
  }
  if (has2ndOrder) return spouseShareAlongside2ndOrder(gueterstand);
  return WHOLE;
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
          // Deeper sibling levels (2+) use parentKindIndex like the kinder line, so
          // delegate them to the generic recursive reassigner.
          kinder: reassignKinderByParentIndex(buckets[index]),
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
    const living1stOrderStaemme = has1stOrder
      ? kinder.filter(hasLivingDescendant).length
      : 0;
    const share = spouseShare(
      input.spouse.gueterstand,
      living1stOrderStaemme,
      has2ndOrder,
    );
    remainingShare = subtractFromWhole(share);
    result.push({
      name: input.spouse.name,
      share,
      order: 0,
      depth: 0,
    });
  }

  let heirMap: Map<string, HeirEntry>;
  if (has1stOrder) {
    heirMap = distributeStamm(kinder, remainingShare);
  } else if (has2ndOrder) {
    heirMap = calculate2ndOrder(elternteile, remainingShare);
  } else {
    heirMap = new Map<string, HeirEntry>();
  }
  const heirOrder = has1stOrder ? 1 : 2;

  for (const [name, entry] of heirMap.entries()) {
    result.push({ name, order: heirOrder, ...entry });
  }

  return result;
}
