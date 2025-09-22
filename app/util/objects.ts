export const objectMap = <V, R>(
  obj: Record<string, V>,
  fn: (value: V, key: string, index: number) => R,
) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));

export function isKeyOfObject<T extends object>(
  key: PropertyKey,
  obj: T,
): key is keyof T {
  return key in obj;
}

/**
 * Creates an array of all possible permutations of an input object, each missing a key
 */
export function dropEachProperty(obj: object) {
  return Object.values(
    Object.keys(obj).map((key) => {
      // eslint-disable-next-line sonarjs/no-unused-vars
      const { [key as keyof typeof obj]: _, ...rest } = obj;
      return rest;
    }),
  );
}

// Picks a property from a union of objects, for example:
// PickFromUnion<{a: string} | {b: string}, "b"> = {b: string | undefined}
export type PickFromUnion<T, K extends PropertyKey> = {
  [P in K]: T extends infer U ? (P extends keyof U ? U[P] : undefined) : never;
};

// Returns a property from a union of objects, for example:
// getPropertyFromUnion({a: "a", b: "b"}, "b") = "b"
export function propertyFromUnion<T extends object, K extends PropertyKey>(
  obj: T | undefined,
  key: K,
): PickFromUnion<T, K>[K] | undefined {
  if (!obj) return undefined;
  return isKeyOfObject(key, obj)
    ? (obj[key] as PickFromUnion<T, K>[K])
    : undefined;
}
