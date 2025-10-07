import type { Config } from "~/services/flow/server/types";
import type { UserData } from "../userData";
import { type ArrayConfigServer } from "~/services/array";

// Old flow tests: forward & backward using full user data
export type TestCases<T extends UserData> = Readonly<
  Array<Readonly<[T, readonly string[]]>>
>;

export type ExpectedStep = {
  stepId: string;
  addArrayItemEvent?: ArrayConfigServer["event"];
  /**
   * Used to test the special case where a page without inputs has a guard that relies on previously-entered data.
   * E.g. Array Summary pages
   */
  skipPageSchemaValidation?: boolean;
  userInput?: UserData;
};

// New flow tests: testing data submission with page schemas
export type FlowTestCases = {
  xstateConfig: Config;
  testcases: Record<string, ExpectedStep[]>;
};
