import { buildStepStatesFromStatusTree } from "../buildStepStatesFromStatusTree";

const flowId = "/beratungshilfe/antrag";

describe("buildStepStatesFromStatusTree", () => {
  it("should build step states from status tree", () => {
    const statusTree = {
      "/step1": {
        isDone: true,
        isReachable: true,
        children: {
          "/step1a": {
            isDone: false,
            isReachable: true,
            children: {},
          },
          "/step2a": {
            isDone: false,
            isReachable: true,
            children: {},
          },
        },
      },
      "/step2": {
        isDone: false,
        isReachable: false,
        children: {},
      },
    };

    const validFlowPaths = [
      "/step1/step1a/start",
      "/step1/step1a/middle",
      "/step1/step1a/end",
      "/step1/step2a/start",
      "/step1/step2a/middle",
      "/step1/step2a/end",
      "/step2/start",
      "/step2/middle",
      "/step2/end",
    ];

    const result = buildStepStatesFromStatusTree(
      statusTree,
      flowId,
      validFlowPaths,
    );

    expect(result).toEqual([
      {
        stepId: "/step1",
        isDone: true,
        isReachable: true,
        url: "/beratungshilfe/antrag/step1/step1a/start",
        subStates: [
          {
            stepId: "/step1/step1a",
            isDone: false,
            isReachable: true,
            url: "/beratungshilfe/antrag/step1/step1a/start",
          },
          {
            stepId: "/step1/step2a",
            isDone: false,
            isReachable: true,
            url: "/beratungshilfe/antrag/step1/step2a/start",
          },
        ],
      },
      {
        stepId: "/step2",
        isDone: false,
        isReachable: false,
        url: "/beratungshilfe/antrag/step2/start",
      },
    ]);
  });

  it("should ignore /ergebnis children when building step states from status tree", () => {
    const statusTree = {
      "/step1": {
        isDone: true,
        isReachable: true,
        children: {
          "/ergebnis": {
            isDone: false,
            isReachable: true,
            children: {},
          },
          "/step1a": {
            isDone: false,
            isReachable: true,
            children: {},
          },
        },
      },
    };

    const validFlowPaths = [
      "/step1/step1a/start",
      "/step1/step1a/middle",
      "/step1/step1a/end",
    ];

    const result = buildStepStatesFromStatusTree(
      statusTree,
      flowId,
      validFlowPaths,
    );

    expect(result).toEqual([
      {
        stepId: "/step1",
        isDone: true,
        isReachable: true,
        url: "/beratungshilfe/antrag/step1/step1a/start",
        subStates: [
          {
            stepId: "/step1/step1a",
            isDone: false,
            isReachable: true,
            url: "/beratungshilfe/antrag/step1/step1a/start",
          },
        ],
      },
    ]);
  });
});
