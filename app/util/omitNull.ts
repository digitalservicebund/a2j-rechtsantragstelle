type NullToUndefined<T> = T extends null
  ? undefined
  : T extends Array<infer U>
    ? Array<NullToUndefined<U>>
    : T extends Record<string, unknown>
      ? { [K in keyof T]: NullToUndefined<T[K]> }
      : T;

/**
 * Deep replacing null values with undefined, see https://stackoverflow.com/a/72549576
 *
 * @example
 * // returns { a: { b: undefined, c: 1 } }
 * omitNull({ a: { b: null, c: 1 } });
 *
 * @example
 * // returns { d: undefined, e: [undefined, { f: undefined }] }
 * omitNull({ d: undefined, e: [null, { f: null }] });
 */

export function omitNull<T>(data: T) {
  let out: unknown = data;
  if (data === null) {
    out = undefined;
  } else if (Array.isArray(data)) {
    out = data.map((value) => omitNull(value));
  } else if (typeof data === "object") {
    out = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, omitNull(value)]),
    );
  }
  return out as NullToUndefined<T>;
}
