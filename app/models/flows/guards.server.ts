import type { AllContexts } from "./common";
import type { Context } from "./contexts";

export type GenericGuard<TContext extends Context> = ({
  context,
}: {
  context: TContext;
}) => boolean;

export type Guards<TContext extends Context = Context> = Record<
  string,
  GenericGuard<TContext>
>;

type KeysOfUnion<T> = T extends T ? keyof T : never;

export function yesNoGuards<Field extends KeysOfUnion<AllContexts>>(
  field: Field,
): { [field in Field as `${field}Yes`]: GenericGuard<AllContexts> } & {
  [field in Field as `${field}No`]: GenericGuard<AllContexts>;
} {
  //@ts-ignore
  return {
    [`${field}Yes`]: ({ context }) => context[field] === "yes",
    [`${field}No`]: ({ context }) => context[field] === "no",
  } satisfies Guards;
}
