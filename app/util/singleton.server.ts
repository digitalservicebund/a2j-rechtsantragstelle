// https://remix.run/docs/en/main/guides/manual-mode#keeping-in-memory-server-state-across-rebuilds

export const singleton = <Value>(
  name: string,
  valueFactory: () => Value,
): Value => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = global as any;
  g.__singletons ??= {};
  g.__singletons[name] ??= valueFactory();
  return g.__singletons[name];
};
