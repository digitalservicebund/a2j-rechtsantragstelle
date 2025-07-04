export const arrayIsNonEmpty = <T>(arr?: T[] | null): arr is T[] =>
  Array.isArray(arr) && arr.length > 0;
