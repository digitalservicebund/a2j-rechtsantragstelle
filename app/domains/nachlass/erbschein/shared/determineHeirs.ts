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
import { personName } from "./personName";
import { BOTH_PARENTS_VALUE } from "~/domains/nachlass/erbschein/shared/buildParentOptions";
import {
  type ErbfolgeData,
  type BaseElternteil,
} from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";
import { z } from "zod";
import { type PersonItem } from "~/domains/nachlass/erbschein/shared/components/types";

export const gueterstandSchema = z.enum([
  "communityOfAcquisitions",
  "separationOfProperty",
  "communityOfProperty",
  "other",
  "unknown",
]);

export type Gueterstand = z.infer<typeof gueterstandSchema>;

export type Heir = {
  name: string;
  share: Fraction;
  // 0=spouse, 1=1st order (kinder/Abkömmlinge), 2=2nd order (Elternteile/Geschwister)
  order: 0 | 1 | 2;
  // 0=spouse; 1st order: 1=Kind, 2=Enkelkind, …; 2nd order: 0=Elternteil, 1=Geschwister, 2=Nichte/Neffe
  depth: number;
};

// Structural supertype of Kind, ElternteilKind, and Elternteil — the distribution
// logic only needs these fields, regardless of which family branch a person is in.
type FamilyMember = Pick<
  PersonItem,
  "vorname" | "nachname" | "isAlive" | "parentKindIndex"
> & {
  hatteKinder?: string;
  kinder?: FamilyMember[];
};

function hasLivingDescendant(member: FamilyMember): boolean {
  if (member.isAlive === "yes") return true;
  if (member.hatteKinder !== "yes") return false;
  return (member.kinder ?? []).some(hasLivingDescendant);
}

export function hasNoFirstOrSecondOrderHeirs(input: ErbfolgeData): boolean {
  return determineHeirs(input).every((heir) => heir.order === 0);
}

type HeirEntry = Pick<Heir, "share" | "depth">;

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
      const name = personName(kind);
      const existing = accumulatedShares.get(name);
      accumulatedShares.set(name, {
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
      result.set(personName(elternteil), { share: elternteilShare, depth: 0 });
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

export function shareLabel({ numerator, denominator }: Heir["share"]): string {
  if (numerator === denominator) return "das gesamte Erbe";
  return `${numerator}/${denominator} des Erbes`;
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
  elternteile: BaseElternteil[],
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

function getHeirMap(
  has1stOrder: boolean,
  has2ndOrder: boolean,
  kinder: FamilyMember[],
  elternteile: FamilyMember[],
  remainingShare: Fraction,
): Map<string, HeirEntry> {
  if (has1stOrder) {
    return distributeStamm(kinder, remainingShare);
  } else if (has2ndOrder) {
    return calculate2ndOrder(elternteile, remainingShare);
  }
  return new Map<string, HeirEntry>();
}

export function determineHeirs(input: ErbfolgeData): Heir[] {
  const kinder = reassignKinderByParentIndex(input.kinder ?? []);
  const elternteile = reassignSiblingsByParentIndex(input.elternteile ?? []);

  const has1stOrder =
    input.hatteKinder === "yes" && kinder.some(hasLivingDescendant);
  const has2ndOrder = !has1stOrder && elternteile.some(isParentStammActive);

  const result: Heir[] = [];
  let remainingShare = WHOLE;

  // If the Verstorbene Peron had a spouse
  if (input.ehepartnerVorname && input.ehepartnerNachname) {
    const living1stOrderStaemme = has1stOrder
      ? kinder.filter(hasLivingDescendant).length
      : 0;
    const share = spouseShare(
      "gueterstand" in input && input.gueterstand
        ? input.gueterstand
        : "communityOfAcquisitions",
      living1stOrderStaemme,
      has2ndOrder,
    );
    remainingShare = subtractFromWhole(share);
    result.push({
      name: personName({
        vorname: input.ehepartnerVorname,
        nachname: input.ehepartnerNachname,
        geburtsname:
          "ehepartnerGeburtsname" in input
            ? input.ehepartnerGeburtsname
            : undefined,
      }),
      share,
      order: 0,
      depth: 0,
    });
  }

  const heirMap = getHeirMap(
    has1stOrder,
    has2ndOrder,
    kinder,
    elternteile,
    remainingShare,
  );
  const heirOrder = has1stOrder ? 1 : 2;

  for (const [name, entry] of heirMap.entries()) {
    result.push({ name, order: heirOrder, ...entry });
  }

  return result;
}
