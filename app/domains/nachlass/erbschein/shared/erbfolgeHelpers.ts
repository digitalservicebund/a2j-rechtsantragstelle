// Returns true if a kind (and all their descendants) have no living heirs.
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
