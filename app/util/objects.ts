export const objectMap = <V, R>(
  obj: { [key: string]: V },
  fn: (value: V, key: string, index: number) => R
) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));

export function isKeyOfObject<T extends object>(
  key: string | number | symbol,
  obj: T
): key is keyof T {
  return key in obj;
}
