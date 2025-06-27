export const objectMap = <V, R>(
  obj: Record<string, V>,
  fn: (value: V, key: string, index: number) => R,
) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));

export const objectKeyMap = <T extends Record<string | number, unknown>>(
  obj: T,
) => objectMap(obj, (_, key) => key) as Record<keyof T, string>;

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
      // eslint-disable-next-line sonarjs/no-unused-vars
      const { [key as keyof typeof obj]: _, ...rest } = obj;
      return rest;
    }),
  );
}
