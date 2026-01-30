import type { StepState } from "~/services/flow/server/buildFlowController";
import { stepStatesToSubflowDoneStates } from "../stepStatesToSubflowDoneStates";

describe("stepStatesToSubflowDoneStates", () => {
  it("evaluated isReachable and isDone, ignores subStates", () => {
    const stepStates = [
      {
        stepId: "step1",
        isReachable: true,
        isDone: true,
        url: "/step1",
      },
      {
        stepId: "step2",
        isReachable: true,
        isDone: true,
        subStates: [
          {
            stepId: "step2a",
            isReachable: true,
            isDone: true,
            url: "/step2",
          },
        ],
        url: "/step2",
      },
      {
        stepId: "step3",
        isReachable: false,
        isDone: true,
        url: "/step3",
      },
      {
        stepId: "step4",
        isReachable: true,
        isDone: false,
        url: "/step4",
      },
    ] satisfies StepState[];

    const expected = {
      step1: true,
      step2: true,
      step3: false,
      step4: false,
    };

    expect(stepStatesToSubflowDoneStates(stepStates)).toEqual(expected);
  });
});
