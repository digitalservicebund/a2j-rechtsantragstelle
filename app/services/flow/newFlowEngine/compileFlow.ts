import { precomputeGraph } from "./precomputeGraph";
import type { NodeKey, PageConfigMap, TransitionConfigMap } from "./types";
import z from "zod";

// The "#" wildcard used in array stepId paths (e.g. "/kinder/#/daten").
// Defined locally to keep the engine decoupled from the app's array service.
const ARRAY_WILDCARD = "#";

type Options<C extends PageConfigMap> = {
  pages: C;
  initialStep: keyof C;
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
  routes: TransitionConfigMap<C>[keyof C],
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
  const arrayInfoCache: Partial<
    Record<NodeKey<C>, { name: string; entryPoint?: string }>
  > = {};

  // Single-pass static initialization
  for (const [key, pageNode] of Object.entries(pages)) {
    const nodeKey = key as NodeKey<C>;

    if (!pageNode.stepId.startsWith("/")) {
      throw new Error(
        `Page path must start with "/": "${pageNode.stepId}" (key: "${key}")`,
      );
    }

    pathMap[pageNode.stepId] = nodeKey;

    const { compiledSchema, fieldNames } = normalizeSchema(pageNode.pageSchema);
    schemaCache[nodeKey] = compiledSchema;
    fieldNamesCache[nodeKey] = fieldNames;

    if (pageNode.arraySummary) {
      arrayInfoCache[nodeKey] = {
        name: pageNode.arraySummary.name,
        entryPoint: getArrayEntryPoint(transitions[nodeKey], pages),
      };
    }
  }

  const graphStats = precomputeGraph(transitions, initialStep);

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
    graphStats,

    getArrayInfo: (path: string) => {
      const nodeKey = getNodeKeyFromPath(path);
      return nodeKey != null ? arrayInfoCache[nodeKey] : undefined;
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
