import { precomputeGraph } from "./precomputeGraph";
import type { PageConfigMap, TransitionConfigMap } from "./types";
import mapValues from "lodash/mapValues";
import invert from "lodash/invert";
import z from "zod";
import { arrayChar } from "~/services/array";

const getCompiledSchema = <C extends PageConfigMap>(
  pageNodeMap: C,
  key?: keyof C,
): z.ZodTypeAny => {
  let pageSchema = {};
  if (key && pageNodeMap[key].pageSchema)
    pageSchema = pageNodeMap[key].pageSchema;
  return z.object(pageSchema);
};

type Options<C extends PageConfigMap> = {
  pageConfigMap: C;
  initialStep: keyof C;
  transitionConfigMap: TransitionConfigMap<C>;
  stepIdLeadingSlash?: boolean;
};

const getArrayEntryPoint = <C extends PageConfigMap>(
  routes: TransitionConfigMap<C>[keyof C],
  pageConfigs: C,
): string | undefined => {
  if (!Array.isArray(routes)) return undefined;
  const addTransition = routes.find((route) => route?.type === "addArrayItem");
  if (addTransition?.target) {
    return pageConfigs[addTransition.target].stepId
      .split(arrayChar)
      .at(-1)
      ?.slice(1);
  }
};

export const compileFlowConfig = <C extends PageConfigMap>({
  pageConfigMap,
  initialStep,
  transitionConfigMap,
  stepIdLeadingSlash = false,
}: Options<C>) => {
  const stepIdMap: Record<string, keyof C> = invert(
    // mapValues(config, (obj) => obj.stepId.replaceAll("/#", "")),
    mapValues(pageConfigMap, "stepId"),
  );
  const graphStats = precomputeGraph(transitionConfigMap, initialStep);

  // slice/prepend "/" depending on stepIdLeadingSlash
  const getKeyFromStepId = (stepId: string): keyof C | undefined =>
    stepIdMap[stepIdLeadingSlash ? stepId.slice(1) : stepId];

  const getStepIdFromKey = (key?: keyof C) =>
    key
      ? (stepIdLeadingSlash ? "/" : "") + pageConfigMap[key].stepId
      : undefined;

  const arrayInfoCache: Record<string, { name: string; entryPoint?: string }> =
    {};

  for (const [key, pageNode] of Object.entries(pageConfigMap)) {
    if (pageNode.arraySummary) {
      arrayInfoCache[pageNode.stepId] = {
        name: pageNode.arraySummary.name,
        entryPoint: getArrayEntryPoint(transitionConfigMap[key], pageConfigMap),
      };
    }
  }

  return {
    pageConfigMap,
    transitionConfigMap,
    initialStep,
    graphStats,
    getArraySummary: (stepId: string) => arrayInfoCache[stepId],
    getSchema: (stepId: string) =>
      getCompiledSchema(pageConfigMap, getKeyFromStepId(stepId)),
    getKeyFromStepId,
    getStepIdFromKey,
    isFinal: (stepId: string) => {
      const key = getKeyFromStepId(stepId);
      return key ? graphStats.isFinal(key) : undefined;
    },
    getProgress: (stepId: string) => {
      const key = getKeyFromStepId(stepId);
      return key ? graphStats.getProgress(key) : undefined;
    },
  };
};

export type StaticFlow<C extends PageConfigMap> = ReturnType<
  typeof compileFlowConfig<C>
>;
