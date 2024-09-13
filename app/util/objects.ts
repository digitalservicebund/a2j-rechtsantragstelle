export const objectMap = <V, R>(
  obj: { [key: string]: V },
  fn: (value: V, key: string, index: number) => R,
) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));

export function isKeyOfObject<T extends object>(
  key: string | number | symbol,
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
      const { [key as keyof typeof obj]: _, ...rest } = obj;
      return rest;
    }),
  );
}
