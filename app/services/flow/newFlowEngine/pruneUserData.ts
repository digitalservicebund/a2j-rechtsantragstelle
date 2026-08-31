import { ARRAY_WILDCARD } from "./compileFlow";
import type { CompiledFlow } from "./compileFlow";
import {
  type PageConfigMap,
  type NodeKey,
  type InferredUserData,
} from "./types";
import { type PageData } from "../pageData";
import { runSimulation } from "~/services/flow/newFlowEngine/simulate";

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
    const arr = target[arrayName] as Array<Record<string, unknown>>;
    if (arr[index] === undefined) arr[index] = {};
    target = arr[index];
  }
  target[fieldName] = value;
};

type VisitedContext<C extends PageConfigMap> = {
  key: NodeKey<C>;
  pageData: PageData;
  scopeData: Record<string, unknown>;
  arrayPath: string[];
};

// Array item page: copy only the fields declared in its schema. scopeData is the
// item at this nesting level; arrayPath + arrayIndexes give the output path.
// fieldNames use "#" notation (e.g. "children#name") but scopeData keys and the
// nested output use the leaf name ("name").
const copyArrayItemFields = <C extends PageConfigMap>(
  result: Record<string, unknown>,
  compiledFlow: CompiledFlow<C>,
  { key, pageData, scopeData, arrayPath }: VisitedContext<C>,
): void => {
  const indexes = pageData.arrayIndexes ?? [];
  for (const fieldName of compiledFlow.getFieldNamesByNodeKey(key)) {
    const leafKey = fieldName.split("#").at(-1)!;
    setNestedField(result, arrayPath, indexes, leafKey, scopeData[leafKey]);
  }
};

// Regular (top-level) page: copy declared fields directly from userData.
const copyTopLevelFields = <C extends PageConfigMap>(
  result: Record<string, unknown>,
  compiledFlow: CompiledFlow<C>,
  nodeKey: NodeKey<C>,
  data: InferredUserData<C>,
): void => {
  for (const field of compiledFlow.getFieldNamesByNodeKey(nodeKey)) {
    const val = (data as Record<string, unknown>)[field];
    if (val !== undefined) result[field] = val;
  }
};

export const pruneUserData = <C extends PageConfigMap>(
  compiledFlow: CompiledFlow<C>,
  visitedContexts: Array<{
    key: NodeKey<C>;
    pageData: PageData;
    scopeData: Record<string, unknown>;
    arrayPath: string[];
  }>,
  data: InferredUserData<C>,
): InferredUserData<C> => {
  const result: Record<string, unknown> = {};

  for (const context of visitedContexts) {
    const page = compiledFlow.pages[context.key];
    if (!page || page.arraySummary) continue;

    if (page.stepId.includes(ARRAY_WILDCARD)) {
      copyArrayItemFields(result, compiledFlow, context);
    } else {
      copyTopLevelFields(result, compiledFlow, context.key, data);
    }
  }

  return result as InferredUserData<C>;
};

export const getPrunedUserDataFromSimulation = <C extends PageConfigMap>(
  compiledFlow: CompiledFlow<C>,
  userData: InferredUserData<C>,
) =>
  pruneUserData(
    compiledFlow,
    runSimulation(userData, compiledFlow).visitedContexts,
    userData,
  );
