export type TestCases<T extends Record<string, string>> = Readonly<
  Array<Readonly<[T, Readonly<Array<string>>]>>
>;
