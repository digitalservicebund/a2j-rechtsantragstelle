import type { AllContextKeys } from "./common";
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

export function yesNoGuards<Field extends AllContextKeys>(field: Field) {
  const fieldYes = `${field}Yes` as const;
  const fieldNo = `${field}No` as const;
  return {
    [fieldYes]: ({ context }: { context: Context }) => context[field] === "yes",
    [fieldNo]: ({ context }: { context: Context }) => context[field] === "no",
  } as Record<typeof fieldYes | typeof fieldNo, GenericGuard<Context>>;
}
