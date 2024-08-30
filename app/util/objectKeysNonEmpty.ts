import { isKeyOfObject } from "./objects";

export function objectKeysNonEmpty<T>(
  object: T | undefined,
  objectKeys: Array<keyof T>,
): boolean {
  if (object === null || object === undefined) {
    return false;
  }

  if (objectKeys.length === 0) {
    return false;
  }

  const hasMissingObjectKey = objectKeys.filter(
    (objectKey) => !isKeyOfObject(objectKey, object),
  );

  if (hasMissingObjectKey.length > 0) {
    return false;
  }

  const hasEmptyObject = Object.entries(object)
    .filter(([key]) => {
      return objectKeys.find((objectKey) => objectKey === key);
    })
    .some(([, value]) => {
      return (
        value === null || typeof value === "undefined" || value.length === 0
      );
    });

  return !hasEmptyObject;
}
