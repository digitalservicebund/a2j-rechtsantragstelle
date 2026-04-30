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
  arraySchema?: z.ZodTypeAny | z.ZodRawShape;
};

export type PageConfigMap = Record<string, PageConfig>;

// --- User Data Inference ---
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

export type InferredUserData<C extends PageConfigMap> = Partial<
  UnionToIntersection<
    {
      [K in keyof C]: C[K] extends { pageSchema: infer S }
        ? InferSchema<S>
        : C[K] extends { arraySchema: infer S }
          ? InferSchema<S>
          : {};
    }[keyof C]
  >
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
