import { type Config } from "~/services/flow/server/types";
import type { AllUserDataKeys, AllowedUserTypes, UserData } from "../userData";
import { type ArrayConfigServer } from "~/services/array";

// Old flow tests: forward & backward using full user data
export type TestCases<T extends UserData> = Readonly<
  Array<Readonly<[T, readonly string[]]>>
>;

type ArrayItemProperties = `${AllUserDataKeys}#${string}`;

export type ExpectedStepUserInput<T extends UserData> = DeepPartial<T> & {
  pageData?: { arrayIndexes?: number[] };
} & { [K in ArrayItemProperties]: AllowedUserTypes };

export type ExpectedStep<T extends UserData> = {
  stepId: string;
  addArrayItemEvent?: ArrayConfigServer["event"];
  /**
   * Used to test transitions; here the current page's pageSchema is irrelevant,
   * but the guard uses pre-exising data to determine transition target
   * E.g. Array Summary pages
   */
  skipPageSchemaValidation?: boolean;
  // Deep partial needed to ensure partial array pages are handled correctly
  userInput?: ExpectedStepUserInput<T>;
};

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type FlowTestCases<T extends UserData> = Record<
  string,
  Array<ExpectedStep<T>>
>;

// New flow tests: testing data submission with page schemas
export type FlowTestConfig<T extends UserData> = {
  xstateConfig: Config;
  testcases: FlowTestCases<T>;
};
