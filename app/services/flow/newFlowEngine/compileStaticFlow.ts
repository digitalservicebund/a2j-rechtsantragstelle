import { precomputeGraph } from "./precomputeGraph";
import type { PageConfigMap, TransitionConfigMap } from "./types";
import z from "zod";
import { arrayChar } from "~/services/array";

type Options<C extends PageConfigMap> = {
  pageConfigMap: C;
  initialStep: keyof C;
  transitionConfigMap: TransitionConfigMap<C>;
  stepIdLeadingSlash?: boolean;
};

type NormalizedSchemaInfo = {
  compiledSchema: z.ZodTypeAny;
  fieldNames: string[];
};

const normalizeSchema = (
  schema?: z.ZodTypeAny | z.ZodRawShape,
): NormalizedSchemaInfo => {
  if (!schema) return { compiledSchema: z.object({}), fieldNames: [] };

  if (!(schema instanceof z.ZodType)) {
    return {
      compiledSchema: z.object(schema),
      fieldNames: Object.keys(schema),
    };
  }

  let fieldNames: string[] = [];
  if (schema instanceof z.ZodObject) {
    fieldNames = Object.keys(schema.shape);
  } else if ("innerType" in schema && typeof schema.innerType === "function") {
    // Handles simple ZodEffects (.refine) wrapping an object
    const inner = schema.innerType();
    if (inner instanceof z.ZodObject) {
      fieldNames = Object.keys(inner.shape);
    }
  }

  return { compiledSchema: schema, fieldNames };
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
  const stepIdMap: Record<string, keyof C> = {};
  const schemaCache: Partial<Record<keyof C, z.ZodTypeAny>> = {};
  const fieldNamesCache: Partial<Record<keyof C, string[]>> = {};
  const arrayInfoCache: Partial<
    Record<keyof C, { name: string; entryPoint?: string }>
  > = {};

  // 1. Single-pass static initialization loop
  for (const [key, pageNode] of Object.entries(pageConfigMap)) {
    const typedKey = key as keyof C;

    const normalizedStepId = pageNode.stepId.startsWith("/")
      ? pageNode.stepId
      : "/" + pageNode.stepId;

    stepIdMap[normalizedStepId] = typedKey;

    // Pre-compile schemas and extract fields for pruning
    const { compiledSchema, fieldNames } = normalizeSchema(pageNode.pageSchema);
    schemaCache[typedKey] = compiledSchema;
    fieldNamesCache[typedKey] = fieldNames;

    // Pre-compute array routing
    if (pageNode.arraySummary) {
      arrayInfoCache[typedKey] = {
        name: pageNode.arraySummary.name,
        entryPoint: getArrayEntryPoint(
          transitionConfigMap[typedKey],
          pageConfigMap,
        ),
      };
    }
  }

  const graphStats = precomputeGraph(transitionConfigMap, initialStep);

  const getKeyFromStepId = (stepId: string): keyof C | undefined =>
    stepIdMap[stepId];

  const getStepIdFromKey = (key?: keyof C): string | undefined => {
    if (!key) return undefined;
    const rawStepId = pageConfigMap[key].stepId;
    return stepIdLeadingSlash && !rawStepId.startsWith("/")
      ? `/${rawStepId}`
      : rawStepId;
  };

  return {
    pageConfigMap,
    transitionConfigMap,
    initialStep,
    graphStats,

    getArraySummary: (stepId: string) => {
      const key = getKeyFromStepId(stepId);
      return key ? arrayInfoCache[key] : undefined;
    },
    getSchema: (stepId: string) => {
      const key = getKeyFromStepId(stepId);
      return key ? schemaCache[key] : undefined;
    },
    getFieldNames: (stepId: string) => {
      const key = getKeyFromStepId(stepId);
      return key ? fieldNamesCache[key] : [];
    },

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
