import type { DescendantEntry, ItemWithPath, KindItem } from "./types";

// URL/path builders. All person trees nest via `/kinder/`, so a full index path
// [i, j, k] maps to base/i/kinder/j/kinder/k/… regardless of which tree it is.

// base/i/inputUrl  or  base/i/kinder/j/inputUrl  etc.
export function buildEditUrl(
  base: string,
  indexes: number[],
  inputUrl: string,
): string {
  const segs = [base];
  indexes.forEach((idx, d) => {
    segs.push(String(idx));
    if (d < indexes.length - 1) segs.push("kinder");
  });
  segs.push(inputUrl);
  return segs.join("/");
}

// Add a new child under parentIndexes:
//   [] → base/count/inputUrl
//   [i] → base/i/kinder/count/inputUrl
//   [i,j] → base/i/kinder/j/kinder/count/inputUrl
export function buildAddUrl(
  base: string,
  parentIndexes: number[],
  count: number,
  inputUrl: string,
): string {
  const parentSegments = parentIndexes.flatMap((parentIndex) => [
    String(parentIndex),
    "kinder",
  ]);
  return [base, ...parentSegments, String(count), inputUrl].join("/");
}

// Pathname used by delete-array-item to locate the parent array:
//   [] → base  (top-level array)
//   [i] → base/i/kinder  (kinder of item[i])
export function buildDeletePathname(
  base: string,
  parentIndexes: number[],
): string {
  const parentSegments = parentIndexes.flatMap((parentIndex) => [
    String(parentIndex),
    "kinder",
  ]);
  return [base, ...parentSegments].join("/");
}

// The `#`-notation array name for a delete category at a given tree depth.
// descendantCategory("kinder", 2) → "kinder#kinder"
// descendantCategory("elternteile", 2) → "elternteile#kinder" (the siblings array)
export function descendantCategory(root: string, treeDepth: number): string {
  return root + "#kinder".repeat(treeDepth - 1);
}

// Resolve the array of candidate parents for a descendant at targetDepth from its full
// index path: navigate `.kinder` down the ancestor path (all but the last two indexes).
// Mirrors buildKinderParentOptions' / buildElternteilKinderParentOptions' navigation.
function parentArrayForDepth(
  items: KindItem[],
  indexes: number[],
  targetDepth: number,
): KindItem[] {
  const ancestorPath = indexes.slice(0, targetDepth - 2);
  return ancestorPath.reduce<KindItem[]>(
    (arr, idx) =>
      Array.isArray(arr[idx]?.kinder) ? (arr[idx].kinder as KindItem[]) : [],
    items,
  );
}

// Collect every item at targetDepth, paired with its parent's name. The parent is taken
// from the item's chosen `parentKindIndex` (authoritative), falling back to the physical
// tree parent when unset or when the index points at a missing or living member —
// mirroring the inheritance calc's reassignment.
export function collectDescendantsWithParentName(
  items: KindItem[],
  targetDepth: number,
): DescendantEntry[] {
  function traverse(
    currentItems: KindItem[],
    currentDepth: number,
    ancestorIndexes: number[],
    parentName: string,
  ): DescendantEntry[] {
    if (currentDepth === targetDepth) {
      return currentItems.map((item, itemIndex) => {
        const indexes = [...ancestorIndexes, itemIndex];
        const chosenIndex = item.parentKindIndex;
        const chosenParent =
          chosenIndex != null
            ? parentArrayForDepth(items, indexes, targetDepth)[
                Number(chosenIndex)
              ]
            : undefined;
        const chosenName =
          chosenParent?.isAlive === "no" ? chosenParent.name : undefined;
        return {
          item,
          indexes,
          directParentName: String(chosenName ?? parentName),
        };
      });
    }
    return currentItems.flatMap((item, itemIndex) =>
      traverse(
        Array.isArray(item.kinder) ? (item.kinder as KindItem[]) : [],
        currentDepth + 1,
        [...ancestorIndexes, itemIndex],
        String(item.name ?? ""),
      ),
    );
  }
  return traverse(items, 1, [], "");
}

// Collect every item at targetDepth with its full index path.
export function collectAtDepth(
  items: KindItem[],
  targetDepth: number,
  currentDepth = 1,
  path: number[] = [],
): ItemWithPath[] {
  if (currentDepth === targetDepth) {
    return items.map((item, itemIndex) => ({
      item,
      indexes: [...path, itemIndex],
    }));
  }
  return items.flatMap((item, itemIndex) => {
    const children = Array.isArray(item.kinder)
      ? (item.kinder as KindItem[])
      : [];
    return collectAtDepth(children, targetDepth, currentDepth + 1, [
      ...path,
      itemIndex,
    ]);
  });
}
