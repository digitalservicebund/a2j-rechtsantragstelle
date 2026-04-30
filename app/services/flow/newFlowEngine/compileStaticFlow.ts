import { precomputeGraph } from "./precomputeGraph";
import type { PageConfigMap, TransitionConfigMap } from "./types";
import mapValues from "lodash/mapValues";
import invert from "lodash/invert";
import z from "zod";
import { arrayChar, fieldIsArray } from "~/services/array";

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
  pageNodeMap: C;
  initialStep: keyof C;
  flowConfig: TransitionConfigMap<C>;
  stepIdLeadingSlash?: boolean;
};

export const compileFlowConfig = <C extends PageConfigMap>({
  pageNodeMap,
  initialStep,
  flowConfig,
  stepIdLeadingSlash = false,
}: Options<C>) => {
  const stepIdMap: Record<string, keyof C> = invert(
    // mapValues(config, (obj) => obj.stepId.replaceAll("/#", "")),
    mapValues(pageNodeMap, "stepId"),
  );
  const graphStats = precomputeGraph(flowConfig, initialStep);

  // slice/prepend "/" depending on stepIdLeadingSlash
  const getKeyFromStepId = (stepId: string): keyof C | undefined =>
    stepIdMap[stepIdLeadingSlash ? stepId.slice(1) : stepId];

  const getStepIdFromKey = (key?: keyof C) =>
    key ? (stepIdLeadingSlash ? "/" : "") + pageNodeMap[key].stepId : undefined;

  return {
    config: pageNodeMap,
    flowConfig,
    initialStep,
    graphStats,
    arrayInfos: (stepId: string) => {
      const currentKey = getKeyFromStepId(stepId);
      if (!currentKey) return undefined;
      const currentConfig = pageNodeMap[currentKey];
      const arraySchemas = currentConfig?.arraySchema ?? {};
      const fieldNames = Object.keys(currentConfig?.pageSchema ?? {});
      // extract array Name either from arraySchema (on array summary) or from fieldName (on array pages)
      const arrayName =
        Object.keys(arraySchemas).at(0) ??
        (fieldNames[0] && fieldIsArray(fieldNames[0])
          ? fieldNames[0]?.split(arrayChar)[0]
          : undefined);
      const arraySchema = Object.values(arraySchemas).at(0);

      // Extract array entryPoint from the router structure
      let entryPoint: string | undefined = undefined;
      const currentTransitionConfig = flowConfig[currentKey];
      if (arraySchema && currentTransitionConfig) {
        const transitions: NonNullable<TransitionConfigMap<C>[keyof C]> =
          Array.isArray(currentTransitionConfig)
            ? currentTransitionConfig
            : [currentTransitionConfig];

        entryPoint = transitions
          .flatMap((t) =>
            t && t.type === "addArrayItem" && t.target
              ? [pageNodeMap[t.target].stepId.split("/").at(-1)]
              : [],
          )
          .at(0);
      }
      return { arrayName, arraySchema, entryPoint };
    },
    getSchema: (stepId: string) =>
      getCompiledSchema(pageNodeMap, getKeyFromStepId(stepId)),
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
