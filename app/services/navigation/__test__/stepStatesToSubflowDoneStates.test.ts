import { stepStatesToSubflowDoneStates } from "../stepStatesToSubflowDoneStates";

describe("stepStatesToSubflowDoneStates", () => {
  it("should return empty object on empty input", () => {
    expect(stepStatesToSubflowDoneStates([])).toEqual({});
  });

  it("should return the stepId as key and isDone as value", () => {
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

  it("should add substates", () => {
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

    expect(stepStatesToSubflowDoneStates(stepStates)).toEqual({
      step1: true,
      step1a: false,
    });
  });

  it("should add substates of substates", () => {
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
            subStates: [
              {
                stepId: "step1a1",
                isReachable: true,
                isDone: true,
                url: "/step1a1",
              },
            ],
          },
        ],
      },
    ];

    expect(stepStatesToSubflowDoneStates(stepStates)).toEqual({
      step1: true,
      step1a: false,
      step1a1: true,
    });
  });
});
