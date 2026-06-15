import { precomputeProgress } from "./precomputeProgress";
import type { NodeKey, PageConfigMap, TransitionConfigMap } from "./types";
import z from "zod";

// The "#" wildcard used in array stepId paths (e.g. "/kinder/#/daten").
// Defined locally to keep the engine decoupled from the app's array service.
export const ARRAY_WILDCARD = "#";

type Options<C extends PageConfigMap> = {
  pages: C;
  initialStep: NodeKey<C>;
  transitions: TransitionConfigMap<C>;
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
  routes: TransitionConfigMap<C>[NodeKey<C>],
  pages: C,
): string | undefined => {
  if (!Array.isArray(routes)) return undefined;
  const addTransition = routes.find((route) => route?.type === "addArrayItem");
  if (addTransition?.target) {
    return pages[addTransition.target].stepId
      .split(ARRAY_WILDCARD)
      .at(-1)
      ?.slice(1);
  }
};

export const compileFlow = <C extends PageConfigMap>({
  pages,
  initialStep,
  transitions,
}: Options<C>) => {
  const pathMap: Record<string, NodeKey<C>> = {};
  const schemaCache: Partial<Record<NodeKey<C>, z.ZodTypeAny>> = {};
  const fieldNamesCache: Partial<Record<NodeKey<C>, string[]>> = {};
  const collectionCache: Partial<
    Record<NodeKey<C>, "vorab-check-pages" | "result-pages">
  > = {};
  const arrayInfoCache: Partial<
    Record<
      NodeKey<C>,
      { name: string; entryPoint?: string; entryNodeKey?: NodeKey<C> }
    >
  > = {};

  // Single-pass static initialization
  for (const [key, pageNode] of Object.entries(pages)) {
    const nodeKey = key as NodeKey<C>;

    if (!pageNode.stepId.startsWith("/")) {
      throw new Error(
        `StepId must start with "/": "${pageNode.stepId}" (nodeKey: "${key}")`,
      );
    }

    pathMap[pageNode.stepId] = nodeKey;

    const { compiledSchema, fieldNames } = normalizeSchema(pageNode.pageSchema);
    schemaCache[nodeKey] = compiledSchema;
    fieldNamesCache[nodeKey] = fieldNames;
    collectionCache[nodeKey] = pageNode.collection ?? "vorab-check-pages";

    if (pageNode.arraySummary) {
      const arrayTransitions = transitions[nodeKey];
      const addTransition = Array.isArray(arrayTransitions)
        ? arrayTransitions.find((t) => t?.type === "addArrayItem")
        : undefined;
      arrayInfoCache[nodeKey] = {
        name: pageNode.arraySummary.name,
        entryPoint: getArrayEntryPoint(arrayTransitions, pages),
        entryNodeKey: addTransition?.target ?? undefined,
      };
    }
  }

  const graphStats = precomputeProgress(transitions, initialStep);

  const getNodeKeyFromPath = (path: string): NodeKey<C> | undefined =>
    pathMap[path];

  const getPathFromNodeKey = (nodeKey?: NodeKey<C>): string | undefined => {
    if (nodeKey == null) return undefined;
    return pages[nodeKey].stepId;
  };

  return {
    pages,
    transitions,
    initialStep,
    initialPath: pages[initialStep].stepId,

    getArrayInfo: (path: string) => {
      const nodeKey = getNodeKeyFromPath(path);
      return nodeKey != null ? arrayInfoCache[nodeKey] : undefined;
    },
    getCollection: (path: string): "vorab-check-pages" | "result-pages" => {
      const nodeKey = getNodeKeyFromPath(path);
      return (
        (nodeKey != null ? collectionCache[nodeKey] : undefined) ??
        "vorab-check-pages"
      );
    },
    getSchema: (path: string) => {
      const nodeKey = getNodeKeyFromPath(path);
      return nodeKey != null ? schemaCache[nodeKey] : undefined;
    },
    getFieldNames: (path: string): string[] => {
      const nodeKey = getNodeKeyFromPath(path);
      return nodeKey != null ? (fieldNamesCache[nodeKey] ?? []) : [];
    },
    getFieldNamesByNodeKey: (nodeKey: NodeKey<C>): string[] =>
      fieldNamesCache[nodeKey] ?? [],
    getArrayInfoByNodeKey: (nodeKey: NodeKey<C>) => arrayInfoCache[nodeKey],

    getNodeKeyFromPath,
    getPathFromNodeKey,
    isFinal: (path: string) => {
      const nodeKey = getNodeKeyFromPath(path);
      return nodeKey != null ? graphStats.isFinal(nodeKey) : undefined;
    },
    getProgress: (path: string) => {
      const nodeKey = getNodeKeyFromPath(path);
      return nodeKey != null ? graphStats.getProgress(nodeKey) : undefined;
    },
  };
};

export type CompiledFlow<C extends PageConfigMap> = ReturnType<
  typeof compileFlow<C>
>;
