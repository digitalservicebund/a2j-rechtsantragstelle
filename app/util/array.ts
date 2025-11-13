import { type ArrayConfigServer } from "~/services/array";

export const arrayIsNonEmpty = <T>(arr?: T[] | null): arr is T[] =>
  Array.isArray(arr) && arr.length > 0;

export const removeArrayIndex = (path: string) =>
  path.split(/\/\d+\//).join("/");

export function findArraysWithCommonCondition(
  arrayConfigurations: Array<[string, ArrayConfigServer]>,
): string[] {
  const uniqueStatementKeys = new Set();
  const duplicateStatementKeys = new Set();
  return arrayConfigurations
    .map(([arrayName, arrayConfig]) => {
      const { statementKey } = arrayConfig;
      if (uniqueStatementKeys.has(statementKey)) {
        duplicateStatementKeys.add(statementKey);
      } else {
        uniqueStatementKeys.add(statementKey);
      }
      return [arrayName, arrayConfig] as const;
    })
    .filter(([, config]) => duplicateStatementKeys.has(config.statementKey))
    .map(([arrayName]) => arrayName);
}
