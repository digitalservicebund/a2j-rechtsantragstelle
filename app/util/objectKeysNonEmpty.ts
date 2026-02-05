import isEmpty from "lodash/isEmpty";

type WithRequired<T, K extends keyof T> = T & {
  [P in K]-?: NonNullable<T[P]>;
};

// This function is more strict than its type predicate.
// On top of non-null/non-undefined it also ensures non-empty array / object
export function objectKeysNonEmpty<
  T extends object,
  K extends keyof NonNullable<T>,
>(
  object: T | null | undefined,
  objectKeys: Readonly<K[]>,
): object is NonNullable<T> & WithRequired<T, K> {
  if (!object) return false;
  return objectKeys.every((key) =>
    // lodash's isEmpty() considers non-object/collection/map/set primitives false
    typeof object[key] === "number" || typeof object[key] === "boolean"
      ? true
      : !isEmpty(object[key]),
  );
}
