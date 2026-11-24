import { type z } from "zod";
import { type FieldApi } from "@rvf/react";
import { type MaybePromise } from "p-map";
import { type Dispatch, type SetStateAction } from "react";
import type {
  SchemaObject,
  UserData,
  AllowedUserTypes,
} from "~/domains/userData";
import type { PageData } from "../pageData";

type InferSchema<S> = S extends z.ZodTypeAny
  ? z.infer<S>
  : S extends z.ZodRawShape
    ? RemoveIndexSignature<z.infer<z.ZodObject<S>>>
    : never;

/**
 * Converts wide (generic) property keys to narrow (literal) property keys
 * i.e. { [key: string]: any } → { foo: any; bar: any }
 */
type RemoveIndexSignature<T> = {
  [
    K in keyof T as string extends K
      ? never
      : number extends K
        ? never
        : symbol extends K
          ? never
          : K
  ]: T[K];
};

type ReadOnlyFields = {
  fieldNames: string[];
  shouldMakeReadOnly: (userData: UserData) => boolean;
};

type FieldValueChangeHandlerProps = {
  value: AllowedUserTypes;
  originalValue: AllowedUserTypes;
  controlledField: FieldApi<any>;
  setControlledFieldSrValue: Dispatch<SetStateAction<string | undefined>>;
};

export type FieldValueChangeHandler = (
  props: FieldValueChangeHandlerProps,
) => MaybePromise<void | (() => void)>;

export type ControlledFieldConfig = {
  fieldName: string;
  handleFieldValueChange: FieldValueChangeHandler;
  getScreenReaderAnnouncementText: (controlledFieldSrValue: string) => string;
};

export type FlowEnginePageConfig = {
  // TODO: rename `stepId` → `path` once the old XState engine is fully retired and all flows have migrated to the new engine.
  stepId: string;
  pageSchema?: SchemaObject;
  /**
   * It's possible that a reachable page isn't relevant in the done calculation (e.g., conditional pages like
   * TGA Anwaltschaft - Klagenden, where array item type affects which pageSchema is used). This property allows the engine
   * to know if it should consider the page in the done calculation.
   */
  isRelevantForDone?: (userData: UserData) => boolean;
  controlledFieldConfig?: ControlledFieldConfig;
  /**
   * Most sub-pages should appear as discreet nav items, nested under
   * their parents (e.g. Finanzielle Angaben - Kinder), but things like arrays
   * should be collapsed into the parent nav item to avoid cluttering the nav with too many items.
   */
  shouldCollapseIntoParentNavItem?: boolean;
  readonlyFields?: ReadOnlyFields;
  arraySummary?: {
    name: string;
    schema: z.ZodArray;
    isArrayRelevant?: (userData: UserData) => boolean;
    shouldDisableAddButton?: (context: UserData) => boolean;
    indexOffset?: number;
    hiddenFields?: string[];
  };
};

export type PagesConfig = Record<string, FlowEnginePageConfig>;
export type NodeKey<C extends PagesConfig> = Extract<keyof C, string>;

// --- User Data Inference ---
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type ExtractNodeSchema<Node> = Node extends {
  arraySummary: { name: infer N extends string; schema: infer S };
}
  ? { [Key in N]: InferSchema<S> }
  : Node extends { pageSchema: infer S }
    ? InferSchema<S>
    : {};

export type InferredUserData<C extends PagesConfig> = Partial<
  UnionToIntersection<ExtractNodeSchema<C[keyof C]>>
> & { pageData?: PageData };

// --- Routing & Guards ---
export type Guard<Data> = (data: Data) => boolean;

type GuardedTransition<Key, Data> = {
  target: Key | null;
  guard?: Guard<Data>;
  type?: "addArrayItem";
};

export type TransitionConfig<Key, Data> =
  Key | null | Array<GuardedTransition<Key, Data>>;

export type TransitionConfigMap<C extends PagesConfig> = Record<
  NodeKey<C>,
  TransitionConfig<NodeKey<C>, InferredUserData<C>>
>;
