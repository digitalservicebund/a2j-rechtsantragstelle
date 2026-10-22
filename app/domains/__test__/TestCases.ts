import type { AllowedUserTypes, AllUserDataKeys, UserData } from "../userData";
import { type AddArrayItemEvent } from "~/services/array";
import { type PageData } from "~/services/flow/pageData";
import { type CompiledFlow } from "~/services/flow/flowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";

type ArrayItemProperties = `${AllUserDataKeys}#${string}`;

export type ExpectedStepUserInput<T extends UserData> = T & {
  pageData?: PageData;
  // oxlint-disable-next-line typescript/consistent-indexed-object-style
} & { [K in ArrayItemProperties]: AllowedUserTypes };

export type ExpectedStep<T extends UserData> = {
  stepId: string;
  addArrayItemEvent?: AddArrayItemEvent;
  /**
   * Used to test transitions; here the current page's pageSchema is irrelevant,
   * but the guard uses pre-exising data to determine transition target
   * E.g. Array Summary pages
   */
  skipPageSchemaValidation?: boolean;
  userInput?: ExpectedStepUserInput<T>;
  pageData?: PageData;
};

export type FlowTestCases<T extends UserData> = Record<
  string,
  Array<ExpectedStep<T>>
>;

// New flow tests: testing data submission with page schemas
export type FlowTestConfig<
  T extends UserData,
  C extends PageConfigMap = PageConfigMap,
> = {
  config?: CompiledFlow<C>;
  testcases: FlowTestCases<T>;
};
