import { type z } from "zod";
import type { PageData } from "../pageDataSchema";
import { type SchemaObject, type UserData } from "~/domains/userData";
import { type ControlledFieldConfig } from "~/domains/pageSchemas";

type InferSchema<S> = S extends z.ZodTypeAny
  ? z.infer<S>
  : S extends z.ZodRawShape
    ? z.infer<z.ZodObject<S>>
    : never;

export type NewFlowEnginePageConfig = {
  // TODO: rename `stepId` → `path` once the old XState engine is fully retired and all flows have migrated to the new engine.
  stepId: string;
  pageSchema?: SchemaObject;
  controlledFieldConfig?: ControlledFieldConfig;
  arraySummary?: {
    name: string;
    schema: z.ZodArray;
    /**
     * statementKey
     */
    fieldName?: string;
    isArrayRelevant?: (userData: UserData) => boolean;
    indexOffset?: number;
    hiddenFields?: string[];
  };
};

export type PageConfigMap = Record<string, NewFlowEnginePageConfig>;
export type NodeKey<C extends PageConfigMap> = Extract<keyof C, string>;

// --- User Data Inference ---
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type ExtractNodeSchema<Node> = Node extends { pageSchema: infer S }
  ? InferSchema<S>
  : Node extends {
        arraySummary: { name: infer N extends string; schema: infer S };
      }
    ? { [Key in N]: InferSchema<S> }
    : {};

export type InferredUserData<C extends PageConfigMap> = Partial<
  UnionToIntersection<ExtractNodeSchema<C[keyof C]>>
>;

// --- Routing & Guards ---
type Guard<Data> = (data: Data) => boolean;

type GuardedTransition<Key, Data> = {
  target: Key | null;
  guard?: Guard<Data>;
  type?: "addArrayItem";
};

export type TransitionConfig<Key, Data> =
  Key | null | Array<GuardedTransition<Key, Data>>;

export type TransitionConfigMap<C extends PageConfigMap> = Record<
  NodeKey<C>,
  TransitionConfig<NodeKey<C>, InferredUserData<C> & { pageData: PageData }>
>;
