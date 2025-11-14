import { type Config } from "~/services/flow/server/types";
import type { UserData } from "../userData";
import { type ArrayConfigServer } from "~/services/array";

// Old flow tests: forward & backward using full user data
export type TestCases<T extends UserData> = Readonly<
  Array<Readonly<[T, readonly string[]]>>
>;

/**
 * Retrieves template literal union of all possible array item property paths
 * in the format arrayname#itemname
 */
type ArrayItemPropertyTypes<T> = {
  [K in keyof T]: NonNullable<T[K]> extends ReadonlyArray<infer U>
    ? U extends object
      ? { [P in Extract<keyof U, string> as `${K & string}#${P}`]: U[P] }
      : // eslint-disable @typescript-eslint/no-empty-object-type
        {}
    : {};
}[keyof T];

export type ExpectedStepUserInput<T extends UserData> = T & {
  pageData?: { arrayIndexes?: number[] };
} & Partial<ArrayItemPropertyTypes<T>>;

export type ExpectedStep<T extends UserData> = {
  stepId: string;
  addArrayItemEvent?: ArrayConfigServer["event"];
  /**
   * Used to test transitions; here the current page's pageSchema is irrelevant,
   * but the guard uses pre-exising data to determine transition target
   * E.g. Array Summary pages
   */
  skipPageSchemaValidation?: boolean;
  userInput?: ExpectedStepUserInput<T>;
};

export type FlowTestCases<T extends UserData> = Record<
  string,
  Array<ExpectedStep<T>>
>;

// New flow tests: testing data submission with page schemas
export type FlowTestConfig<T extends UserData> = {
  xstateConfig: Config;
  testcases: FlowTestCases<T>;
};
