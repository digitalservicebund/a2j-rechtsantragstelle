// https://remix.run/docs/en/main/guides/manual-mode#keeping-in-memory-server-state-across-rebuilds

export const singleton = <Value>(
  name: string,
  valueFactory: () => Value,
): Value => {
  const g = globalThis as any;
  g.__singletons ??= {};
  g.__singletons[name] ??= valueFactory();
  return g.__singletons[name];
};
