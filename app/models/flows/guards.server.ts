import type { Context } from "./contexts";

// type GenericGuard = ({ context }: { context: Context }) => boolean;
type GenericGuard<TContext extends Context> = ({
  context,
}: {
  context: TContext;
}) => boolean;

export type Guards<TContext extends Context = Context> = Record<
  string,
  GenericGuard<TContext>
>;
