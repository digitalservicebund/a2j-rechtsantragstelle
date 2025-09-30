import type { Config } from "~/services/flow/server/types";
import type { UserData } from "../userData";
import { type ArrayConfigServer } from "~/services/array";

// Old flow tests: forward & backward using full user data
export type TestCases<T extends UserData> = Readonly<
  Array<Readonly<[T, readonly string[]]>>
>;

// New flow tests: testing data submission with page schemas
export type FlowTestCases = {
  xstateConfig: Config;
  testcases: Record<
    string,
    Array<{
      stepId: string;
      addArrayItemStep?: ArrayConfigServer["event"];
      userInput?: UserData;
    }>
  >;
};
