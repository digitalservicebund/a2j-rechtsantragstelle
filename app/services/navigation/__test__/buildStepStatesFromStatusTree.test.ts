import { getMetaConfigurationByStepId } from "~/services/flow/getMetaConfigurationByStepId";
import { buildStepStatesFromStatusTree } from "../buildStepStatesFromStatusTree";

const flowId = "/beratungshilfe/antrag";

vi.mock("~/services/flow/getMetaConfigurationByStepId");

beforeEach(() => {
  vi.clearAllMocks();
});

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

  it("should return step states with excludedFromValidation property if meta configuration exists", () => {
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
      "/step2/start",
      "/step2/middle",
      "/step2/end",
    ];

    vi.mocked(getMetaConfigurationByStepId).mockImplementation((_, stepId) => {
      if (stepId === "/step1") {
        return { excludedFromValidation: false };
      }

      if (stepId === "/step2") {
        return { excludedFromValidation: true };
      }

      return undefined;
    });

    const result = buildStepStatesFromStatusTree(
      statusTree,
      flowId,
      validFlowPaths,
    );

    expect(result).toMatchObject([
      {
        stepId: "/step1",
        excludedFromValidation: false,
        subStates: [
          {
            stepId: "/step1/step1a",
            excludedFromValidation: undefined,
          },
        ],
      },
      {
        stepId: "/step2",
        excludedFromValidation: true,
      },
    ]);
  });
});
