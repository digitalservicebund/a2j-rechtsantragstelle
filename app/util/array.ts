import { ARRAY_WILDCARD } from "~/services/flow/newFlowEngine/compileFlow";

export const arrayIsNonEmpty = <T>(arr?: T[] | null): arr is T[] =>
  Array.isArray(arr) && arr.length > 0;

export const removeArrayIndex = (path: string) =>
  path.split(/\/\d+\//).join("/");

export const removeArrayIndexWithWildcard = (path: string) =>
  path.replace(/\/\d+\//g, `/${ARRAY_WILDCARD}/`);
