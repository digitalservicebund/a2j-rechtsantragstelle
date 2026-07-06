import { createFlowSession } from "../../newFlowEngine/createFlowSession";
import { flowDestinationNewEngine } from "../flowDestinationNewEngine";
import type { CompiledFlow } from "../../newFlowEngine/compileFlow";
import type { PageConfigMap } from "../../newFlowEngine/types";

vi.mock("../../newFlowEngine/createFlowSession", () => ({
  createFlowSession: vi.fn(),
}));

const INITIAL_PAGE_FLOW = "/initial-step";
const mockCompiledStaticFlow = {} as CompiledFlow<PageConfigMap>;
const mockUserDataPruned = {} as Parameters<typeof createFlowSession>[1];

const getMockFlowEngineSession = (nextPath?: string) => {
  return {
    nextPath,
    initialPath: INITIAL_PAGE_FLOW,
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("flowDestinationNewEngine", () => {
  it("should return the next step in case it does not have an array", () => {
    vi.mocked(createFlowSession).mockReturnValue(
      getMockFlowEngineSession("/next-step") as ReturnType<
        typeof createFlowSession
      >,
    );

    const actual = flowDestinationNewEngine(
      "/beratungshilfe/antrag/some-path",
      mockCompiledStaticFlow,
      mockUserDataPruned,
    );

    expect(actual).toBe("/beratungshilfe/antrag/next-step");
  });

  it("should return the initial step in case it does not have an array and next step", () => {
    vi.mocked(createFlowSession).mockReturnValue(
      getMockFlowEngineSession() as ReturnType<typeof createFlowSession>,
    );

    const actual = flowDestinationNewEngine(
      "/beratungshilfe/antrag/some-path",
      mockCompiledStaticFlow,
      mockUserDataPruned,
    );

    expect(actual).toBe("/beratungshilfe/antrag/initial-step");
  });

  it("should return the array next-step if the pathname contains an array", () => {
    vi.mocked(createFlowSession).mockReturnValue(
      getMockFlowEngineSession(
        "/finanzielle-angaben/kinder/kinder/address",
      ) as ReturnType<typeof createFlowSession>,
    );

    const actual = flowDestinationNewEngine(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/name",
      mockCompiledStaticFlow,
      mockUserDataPruned,
    );

    expect(actual).toBe(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/address",
    );
  });
});
