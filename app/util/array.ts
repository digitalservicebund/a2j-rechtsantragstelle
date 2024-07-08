export const arrayIsNonEmpty = <T>(arr?: T[]): arr is T[] =>
  arr !== undefined && arr.length > 0;
