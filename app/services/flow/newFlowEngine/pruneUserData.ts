import { ARRAY_WILDCARD } from "./compileFlow";
import type { CompiledFlow } from "./compileFlow";
import type { PageConfigMap, NodeKey, InferredUserData } from "./types";
import type { PageData } from "../pageDataSchema";

// Navigates/creates the nested path in `obj` using `arrayPath` + `indexes`,
// then sets `fieldName = value` on the deepest object.
// e.g. arrayPath=["children","toys"], indexes=[0,1], fieldName="name"
//   -> obj.children[0].toys[1].name = value
const setNestedField = (
  obj: Record<string, unknown>,
  arrayPath: string[],
  indexes: number[],
  fieldName: string,
  value: unknown,
): void => {
  if (value === undefined) return;
  let target: Record<string, unknown> = obj;
  for (let i = 0; i < arrayPath.length; i++) {
    const arrayName = arrayPath[i];
    const index = indexes[i];
    if (!Array.isArray(target[arrayName])) target[arrayName] = [];
    const arr = target[arrayName] as Record<string, unknown>[];
    if (arr[index] === undefined) arr[index] = {};
    target = arr[index];
  }
  target[fieldName] = value;
};

export const pruneUserData = <C extends PageConfigMap>(
  compiledFlow: CompiledFlow<C>,
  visitedContexts: Array<{
    key: NodeKey<C>;
    pageData: PageData;
    scopeData: Record<string, unknown>;
    arrayPath: string[];
  }>,
  data: InferredUserData<C> & { pageData: PageData },
): InferredUserData<C> => {
  const result: Record<string, unknown> = {};

  for (const {
    key: nodeKey,
    pageData,
    scopeData,
    arrayPath,
  } of visitedContexts) {
    const page = compiledFlow.pages[nodeKey];
    if (!page || page.arraySummary) continue;

    if (page.stepId.includes(ARRAY_WILDCARD)) {
      // Array item page: copy only the fields declared in its schema.
      // scopeData is the item at this nesting level; arrayPath + arrayIndexes
      // give the reconstruction path in the output.
      // fieldNames use "#" notation (e.g. "children#name") for form resolution,
      // but scopeData keys and the nested output use the leaf name ("name").
      const indexes = pageData.arrayIndexes ?? [];
      for (const fieldName of compiledFlow.getFieldNamesByNodeKey(nodeKey)) {
        const leafKey = fieldName.split("#").at(-1)!;
        setNestedField(result, arrayPath, indexes, leafKey, scopeData[leafKey]);
      }
    } else {
      // Regular (top-level) page: copy declared fields directly from userData.
      for (const field of compiledFlow.getFieldNamesByNodeKey(nodeKey)) {
        const val = (data as Record<string, unknown>)[field];
        if (val !== undefined) result[field] = val;
      }
    }
  }

  return result as InferredUserData<C>;
};
