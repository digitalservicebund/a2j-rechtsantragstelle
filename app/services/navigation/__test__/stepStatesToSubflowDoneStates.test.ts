import { stepStatesToSubflowDoneStates } from "../stepStatesToSubflowDoneStates";

describe("stepStatesToSubflowDoneStates", () => {
  it("returns empty object on empty input", () => {
    expect(stepStatesToSubflowDoneStates([])).toEqual({});
  });

  it("maps to stepId as key and isDone as value", () => {
    expect(
      stepStatesToSubflowDoneStates([
        {
          stepId: "step1",
          isReachable: true,
          isDone: true,
          url: "/step1",
        },
        {
          stepId: "step2",
          isReachable: true,
          isDone: false,
          url: "/step1",
        },
      ]),
    ).toEqual({ step1: true, step2: false });
  });

  it("ignores substates", () => {
    const stepStates = [
      {
        stepId: "step1",
        isReachable: true,
        isDone: true,
        url: "/step1",
        subStates: [
          {
            stepId: "step1a",
            isReachable: false,
            isDone: false,
            url: "/step1a",
          },
        ],
      },
    ];

    expect(stepStatesToSubflowDoneStates(stepStates)).toEqual({ step1: true });
  });
});
