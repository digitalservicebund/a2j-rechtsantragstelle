type Data =
  | {
      [key: string]: any;
    }
  | null
  | Data[];

/**
 * Deep omitting of null values in object, array or combination.
 *
 * @example
 * // returns { a: { c: 1 } }
 * omitNull({ a: { b: null, c: 1 } });
 *
 * @example
 * // returns { d: undefined, e: [{}] }
 * omitNull({ d: undefined, e: [null, { f: null }] });
 */
export function omitNull(data: Data): Data {
  if (!data) return data;

  const entries = Object.entries(data).filter(([, value]) => {
    return value !== null;
  });

  const withoutNull = entries.map(([key, v]) => {
    const value = typeof v === "object" ? omitNull(v) : v;
    return [key, value];
  });

  if (Array.isArray(data)) {
    // return a "real" array
    return withoutNull.map((v) => v[1]);
  }

  return Object.fromEntries(withoutNull);
}
