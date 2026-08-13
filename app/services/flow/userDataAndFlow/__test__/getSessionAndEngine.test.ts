import {
  type CompiledFlow,
  compileFlow,
} from "../../newFlowEngine/compileFlow";
import { type PageConfigMap } from "../../newFlowEngine/types";
import { getSessionAndEngine } from "../getSessionAndEngine";

const mockFlowId = "/beratungshilfe/antrag";

const pages = {
  start: { stepId: "/start" },
  middle: { stepId: "/middle" },
  end: { stepId: "/end" },
} as const;

const transitions = {
  start: "middle",
  middle: "end",
  end: null,
} as const;

const newEngineConfig = compileFlow({
  pages,
  initialStep: "start",
  transitions,
}) as CompiledFlow<PageConfigMap>;

vi.mock("~/services/session.server", () => ({
  getSessionManager: vi.fn().mockReturnValue({
    getSession: vi.fn().mockReturnValue({ get: () => ({}), set: vi.fn() }),
  }),
}));

describe("getSessionAndEngine", () => {
  it("should throw a 404 response if the parameter newEngineConfig is not defined", async () => {
    await expect(
      getSessionAndEngine(mockFlowId, undefined, "", "step-1"),
    ).rejects.toThrow(expect.anything());
  });

  it("should return an error result with redirectTo if the engine throws an error during creation", async () => {
    const result = await getSessionAndEngine(
      mockFlowId,
      newEngineConfig,
      "",
      "non-existing-step",
    );

    expect(result.isErr).toBe(true);
    expect(result.isErr ? result.error.redirectTo : "").toBe(
      "/beratungshilfe/antrag/start",
    );
  });

  it("should return an ok result with flowSession and flowSessionEngine if the engine is created successfully", async () => {
    const result = await getSessionAndEngine(
      mockFlowId,
      newEngineConfig,
      "",
      "/start",
    );

    expect(result.isOk).toBe(true);
    expect(result.isOk ? result.value.flowSession : null).not.toBeNull();
    expect(result.isOk ? result.value.flowSessionEngine : null).not.toBeNull();
  });
});
