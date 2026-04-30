import { type z } from "zod";
import type { PageData } from "../pageDataSchema";

type InferSchema<S> = S extends z.ZodTypeAny
  ? z.infer<S>
  : S extends z.ZodRawShape
    ? z.infer<z.ZodObject<S>>
    : never;

type PageConfig = {
  stepId: string;
  pageSchema?: z.ZodTypeAny | z.ZodRawShape;
  arraySummary?: {
    name: string;
    schema: z.ZodArray;
  };
};

export type PageConfigMap = Record<string, PageConfig>;

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
  | Key
  | null
  | Array<GuardedTransition<Key, Data>>;

export type TransitionConfigMap<C extends PageConfigMap> = Record<
  keyof C,
  TransitionConfig<keyof C, InferredUserData<C> & { pageData: PageData }>
>;
