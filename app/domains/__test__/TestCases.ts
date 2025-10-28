import type { Config } from "~/services/flow/server/types";
import type { UserData } from "../userData";
import { type ArrayConfigServer } from "~/services/array";
import { type Guards } from "~/domains/guards.server";

// Old flow tests: forward & backward using full user data
export type TestCases<T extends UserData> = Readonly<
  Array<Readonly<[T, readonly string[]]>>
>;

export type ExpectedStep = {
  stepId: string;
  addArrayItemEvent?: ArrayConfigServer["event"];
  /**
   * Used to test transitions; here the current page's pageSchema is irrelevant,
   * but the guard uses pre-exising data to determine transition target
   * E.g. Array Summary pages
   */
  skipPageSchemaValidation?: boolean;
  userInput?: UserData;
};

// New flow tests: testing data submission with page schemas
export type FlowTestCases = {
  xstateConfig: Config;
  testcases: Record<string, ExpectedStep[]>;
  /**
   * Legacy guard injection, used in cases where legacy guards are referenced
   * via string instead of inline logic
   */
  guards?: Guards;
};
