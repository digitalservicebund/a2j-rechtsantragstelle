import type {
  FlowTestCases,
  FlowTestConfig,
  ExpectedStep,
} from "~/domains/__test__/TestCases";
import z from "zod";
import type { PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { fluggastrechteVorabcheckFlowConfig } from "../flowConfig";
import { fluggastrechteVorabcheckXstateConfig } from "../xstateConfig";
import type { FluggastrechtVorabcheckUserData } from "../userData";
import { fluggastrechteVorabcheckPages } from "../pages";
import { testCasesFluggastrechteAnnullierungAbbruch } from "./testcasesAnnullierungAbbruch";
import { testCasesFluggastrechteErfolg } from "./testcasesErfolg";
import { testcasesFluggastrechteErfolgAnalog } from "./testcasesErfolgAnalog";
import { testCasesFluggastrechteErfolgEU } from "./testcasesErfolgEU";
import { testcasesFluggastrechtOtherErfolgs } from "./testcasesOtherErfolgs";
import { testCasesFluggastrechteNichtBefoerderungAbbruch } from "./testcasesNichtBefoerderungAbbruch";
import {
  testCasesFluggastrechteNichtBefoerderungErfolg,
  testCasesFluggastrechteNichtBefoerderungVertretbareGruende,
} from "./testcasesNichtBefoerderungErfolg";
import { testCasesFluggastrechteVerspaetetAbbruch } from "./testcasesVerspaetetAbbruch";
import { testCasesFluggastrechteFluggesellschaftAbbruch } from "./testcasesFluggesellschaftAbbruch";

type FluggastrechteTestCase = readonly [
  FluggastrechtVorabcheckUserData,
  readonly string[],
];

const pageByPath = Object.fromEntries(
  Object.entries(fluggastrechteVorabcheckPages).map(([pageKey, page]) => [
    `/${page.stepId}`,
    { pageKey, page },
  ]),
);

const toExpectedSteps = ([userInput, stepIds]: FluggastrechteTestCase): Array<
  ExpectedStep<FluggastrechtVorabcheckUserData>
> =>
  stepIds.map((stepId) => {
    const page = pageByPath[stepId]?.page;
    const pageSchema =
      page && "pageSchema" in page ? page.pageSchema : undefined;
    const hasInvalidPageInput =
      pageSchema && !z.validate(z.object(pageSchema), userInput);

    return {
      stepId,
      ...(pageSchema ? { userInput } : {}),
      ...(hasInvalidPageInput ? { skipPageSchemaValidation: true } : {}),
    };
  });

const toFlowTestCases = (
  prefix: string,
  testCases: readonly FluggastrechteTestCase[],
): FlowTestCases<FluggastrechtVorabcheckUserData> =>
  Object.fromEntries(
    testCases.map((testCase, index) => [
      `${prefix}-${index + 1}`,
      toExpectedSteps(testCase),
    ]),
  );

const legacyTestCases: ReadonlyArray<
  [string, readonly FluggastrechteTestCase[]]
> = [
  ["annullierung-abbruch", testCasesFluggastrechteAnnullierungAbbruch],
  ["erfolg", testCasesFluggastrechteErfolg],
  ["erfolg-analog", testcasesFluggastrechteErfolgAnalog],
  ["erfolg-eu", testCasesFluggastrechteErfolgEU],
  ["other-erfolgs", testcasesFluggastrechtOtherErfolgs],
  [
    "nichtbefoerderung-abbruch",
    testCasesFluggastrechteNichtBefoerderungAbbruch,
  ],
  ["nichtbefoerderung-erfolg", testCasesFluggastrechteNichtBefoerderungErfolg],
  [
    "nichtbefoerderung-vertretbare-gruende",
    testCasesFluggastrechteNichtBefoerderungVertretbareGruende,
  ],
  ["verspaetet-abbruch", testCasesFluggastrechteVerspaetetAbbruch],
  ["fluggesellschaft-abbruch", testCasesFluggastrechteFluggesellschaftAbbruch],
];

const testcases: FlowTestCases<FluggastrechtVorabcheckUserData> = Object.assign(
  {},
  ...legacyTestCases.map(([prefix, testCases]) =>
    toFlowTestCases(prefix, testCases),
  ),
);

export const fluggastrechteVorabcheckTestCases = {
  xstateConfig: fluggastrechteVorabcheckXstateConfig,
  newEngineConfig: fluggastrechteVorabcheckFlowConfig,
  testcases,
} satisfies FlowTestConfig<FluggastrechtVorabcheckUserData, PageConfigMap>;
