import { type UserData } from "~/domains/userData";
import { precomputeProgress } from "./precomputeProgress";
import type { NodeKey, PageConfigMap, TransitionConfigMap } from "./types";
import z from "zod";
import { type FlowTransitionConfig } from "~/services/flow/newFlowEngine/flowTransitionValidationNewEngine";

// The "#" wildcard used in array stepId paths (e.g. "/kinder/#/daten").
// Defined locally to keep the engine decoupled from the app's array service.
export const ARRAY_WILDCARD = "#";

// Array name from a stepId's "#" segments.
// "/parents/#/children/#/daten" gives "parents#children".
export const inferArrayNameFromStepId = (stepId: string): string => {
  const segments = stepId.split("/");
  return segments
    .filter((_, index) => segments[index + 1] === ARRAY_WILDCARD)
    .join("#");
};

// "singlePass" prunes against the current data once. "cascading" re-prunes
// until stable, so pages kept alive only by stale fields also fall off.
type PruningStrategy = "singlePass" | "cascading";

type Options<C extends PageConfigMap> = {
  pages: C;
  initialStep: NodeKey<C>;
  transitions: TransitionConfigMap<C>;
  pruningStrategy?: PruningStrategy;
  flowTransitionConfig?: FlowTransitionConfig;
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

const unwrapArray = (schema: z.ZodType): z.ZodArray | undefined => {
  if (schema instanceof z.ZodArray) return schema;
  const inner = (schema as { unwrap?: () => z.ZodType }).unwrap?.();
  return inner instanceof z.ZodArray ? inner : undefined;
};

// Follows the "#"-path of field names down an array's item schema and reports
// whether the array field at the end is declared `.optional()`.
// e.g. path ["dokumenten"] on the abschnitte item, or ["a", "b"] one level deeper.
const isOptionalArrayField = (
  itemSchema: z.ZodType,
  [field, ...deeper]: string[],
): boolean => {
  if (!(itemSchema instanceof z.ZodObject)) return false;
  const fieldSchema = itemSchema.shape[field] as z.ZodType | undefined;
  if (!fieldSchema) return false;
  if (deeper.length === 0) return fieldSchema.safeParse(undefined).success;
  const innerArray = unwrapArray(fieldSchema);
  return innerArray
    ? isOptionalArrayField(innerArray.element as z.ZodType, deeper)
    : false;
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
  pruningStrategy = "singlePass",
}: Options<C>) => {
  const pathMap: Record<string, NodeKey<C>> = {};
  const schemaCache: Partial<Record<NodeKey<C>, z.ZodTypeAny>> = {};
  const fieldNamesCache: Partial<Record<NodeKey<C>, string[]>> = {};
  const arrayInfoCache: Partial<
    Record<
      NodeKey<C>,
      {
        name: string;
        entryPoint?: string;
        entryNodeKey?: NodeKey<C>;
        fieldName?: string;
        isArrayRelevant?: (userData: UserData) => boolean;
        indexOffset?: number;
        hiddenFields?: string[];
      }
    >
  > = {};
  // Array name (e.g. "items") -> its declared array schema, so array-field
  // optionality can be looked up by "#"-notation name.
  const arraySchemas = new Map<string, z.ZodArray>();

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
    const nodeTransitions = transitions[nodeKey];
    const addTransition = Array.isArray(nodeTransitions)
      ? nodeTransitions.find((t) => t?.type === "addArrayItem")
      : undefined;

    if (pageNode.arraySummary) {
      arraySchemas.set(pageNode.arraySummary.name, pageNode.arraySummary.schema);
      arrayInfoCache[nodeKey] = {
        name: pageNode.arraySummary.name,
        entryPoint: getArrayEntryPoint(nodeTransitions, pages),
        entryNodeKey: addTransition?.target ?? undefined,
        fieldName: pageNode.arraySummary.fieldName,
        isArrayRelevant: pageNode.arraySummary.isArrayRelevant,
        indexOffset: pageNode.arraySummary.indexOffset,
        hiddenFields: pageNode.arraySummary.hiddenFields,
      };
    } else if (addTransition?.target != null) {
      // Non-summary node with addArrayItem: populate array info so the BFS
      // can fan out items. entryPoint is left undefined so callers know not
      // to render array summary UI for this page.
      const target = addTransition.target;
      const name = inferArrayNameFromStepId(pages[target].stepId);
      if (name) {
        arrayInfoCache[nodeKey] = {
          name,
          entryPoint: undefined,
          entryNodeKey: target,
        };
      }
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
    pruningStrategy,
    getArrayInfo: (path: string) => {
      const nodeKey = getNodeKeyFromPath(path);
      return nodeKey == null ? undefined : arrayInfoCache[nodeKey];
    },
    // Whether the array named in "#"-notation (e.g. "items#sub") is optional,
    // so an empty one is still a valid, complete state.
    isOptionalArray: (name: string): boolean => {
      const [root, ...fields] = name.split(ARRAY_WILDCARD);
      const rootSchema = arraySchemas.get(root);
      if (!rootSchema || fields.length === 0) return false;
      return isOptionalArrayField(rootSchema.element as z.ZodType, fields);
    },
    getSchema: (path: string) => {
      const nodeKey = getNodeKeyFromPath(path);
      return nodeKey == null ? undefined : schemaCache[nodeKey];
    },
    getFieldNames: (path: string): string[] => {
      const nodeKey = getNodeKeyFromPath(path);
      return nodeKey == null ? [] : (fieldNamesCache[nodeKey] ?? []);
    },
    getFieldNamesByNodeKey: (nodeKey: NodeKey<C>): string[] =>
      fieldNamesCache[nodeKey] ?? [],
    getSchemaByNodeKey: (nodeKey: NodeKey<C>): z.ZodTypeAny | undefined =>
      schemaCache[nodeKey],

    getNodeKeyFromPath,
    getPathFromNodeKey,
    isFinal: (path: string) => {
      const nodeKey = getNodeKeyFromPath(path);
      return nodeKey == null ? undefined : graphStats.isFinal(nodeKey);
    },
    getProgress: (path: string) => {
      const nodeKey = getNodeKeyFromPath(path);
      return nodeKey == null ? undefined : graphStats.getProgress(nodeKey);
    },
  };
};

export type CompiledFlow<C extends PageConfigMap> = ReturnType<
  typeof compileFlow<C>
>;
