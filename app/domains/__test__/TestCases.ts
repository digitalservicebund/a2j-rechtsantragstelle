import type { UserData } from "../userData";

// Old flow tests: forward & backward using full user data
export type TestCases<T extends UserData> = Readonly<
  Array<Readonly<[T, readonly string[]]>>
>;

// New flow tests: testing data submission with page schemas
export type FlowTestCases = Record<
  string,
  Array<{
    stepId: string;
    userInput?: UserData;
  }>
>;
