import isEmpty from "lodash/isEmpty";

export function objectKeysNonEmpty<T>(
  object: T | undefined | null,
  objectKeys: Readonly<Array<keyof T>>,
): object is Required<T> {
  if (!object) return false;
  return !objectKeys.some(
    (objectKey) =>
      !object[objectKey] ||
      (typeof object[objectKey] === "object" && isEmpty(object[objectKey])),
  );
}
