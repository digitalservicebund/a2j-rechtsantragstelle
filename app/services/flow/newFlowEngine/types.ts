import { type z } from "zod";
import type { PageData } from "../pageDataSchema";

// --- Schema Inference ---
type RawSchemaShape = Record<string, z.ZodTypeAny>;

type InferSchema<S> = S extends z.ZodTypeAny
  ? z.infer<S>
  : S extends RawSchemaShape
    ? { [K in keyof S]: z.infer<S[K]> }
    : never;

// --- Config Base ---
export type FlowConfigBase = Record<
  string,
  {
    stepId: string;
    pageSchema?: z.ZodTypeAny | RawSchemaShape;
    arraySchema?: z.ZodTypeAny | RawSchemaShape;
  }
>;

// --- User Data Inference ---
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

export type InferredUserData<C extends FlowConfigBase> = Partial<
  UnionToIntersection<
    {
      [K in keyof C]: C[K] extends
        | { pageSchema: infer S }
        | { arraySchema: infer S }
        ? InferSchema<S>
        : {};
    }[keyof C]
  >
>;

// --- Routing & Guards ---
type TransitionGuard<Data> = (data: Data) => boolean;

type GuardedTransition<Key, Data> = {
  target: Key | null;
  guard?: TransitionGuard<Data>;
  type?: "addArrayItem";
};

export type RouteDefinition<Key, Data> =
  | Key
  | null
  | Array<GuardedTransition<Key, Data>>;

export type FlowRoutingConfig<C extends FlowConfigBase> = Record<
  keyof C,
  RouteDefinition<keyof C, InferredUserData<C> & { pageData: PageData }>
>;
