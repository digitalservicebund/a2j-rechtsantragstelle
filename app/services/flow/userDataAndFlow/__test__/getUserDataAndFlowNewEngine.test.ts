import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
import { getUserDataAndFlowNewEngine } from "../getUserDataAndFlowNewEngine";
import { getSessionAndEngine } from "../getSessionAndEngine";
import { Result } from "true-myth/result";
import { validateStepIdFlowNewEngine } from "../validateStepIdFlowNewEngine";
import { createSession } from "react-router";
import { compileFlow } from "../../newFlowEngine/compileFlow";
import { createFlowSession } from "../../newFlowEngine/createFlowSession";
import { getMetaConfigurationByStepId } from "../../getMetaConfigurationByStepId";

vi.mock("~/services/isFeatureFlagEnabled.server");
vi.mock("../getSessionAndEngine");
vi.mock("../validateStepIdFlowNewEngine");
vi.mock("../../getMetaConfigurationByStepId");

const mockRequest = new Request(
  "http://example.com/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht",
);
const mockURL = new URL(
  "http://example.com/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht",
);
const mockSession = createSession();

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

const compiledFlow = compileFlow({
  pages,
  initialStep: "start",
  transitions,
});

const mockFlowSessionEngine = createFlowSession(
  compiledFlow,
  { pageData: { arrayIndexes: [] } },
  "/start",
);

describe("getUserDataAndFlowNewEngine", () => {
  it("should thrown an exception in case feature flag is disabled", async () => {
    vi.mocked(isFeatureFlagEnabled).mockResolvedValue(false);
    await expect(
      getUserDataAndFlowNewEngine(
        new Request("http://example.com/nachlass/erbausschlagung/anfrage"),
        new URL("http://example.com/nachlass/erbausschlagung/anfrage"),
      ),
    ).rejects.toThrow(expect.anything());
  });

  it("should return an error and redirect in case is not possible to get session and engine", async () => {
    vi.mocked(getSessionAndEngine).mockResolvedValue(
      Result.err({ redirectTo: "redirectToPage" }),
    );

    const result = await getUserDataAndFlowNewEngine(mockRequest, mockURL);

    expect(result.isErr).toBe(true);
    expect(result.isErr ? result.error.redirectTo : "").toBe("redirectToPage");
  });

  it("should return an error and redirect in case the stepId is not valid", async () => {
    vi.mocked(getSessionAndEngine).mockResolvedValue(
      Result.ok({
        flowSession: mockSession,
        flowSessionEngine: mockFlowSessionEngine,
      }),
    );

    vi.mocked(validateStepIdFlowNewEngine).mockReturnValue(
      Result.err({ redirectTo: "redirectToPage" }),
    );

    const result = await getUserDataAndFlowNewEngine(mockRequest, mockURL);

    expect(result.isErr).toBe(true);
    expect(result.isErr ? result.error.redirectTo : "").toBe("redirectToPage");
  });

  it("should return ok and with all the correct data", async () => {
    vi.mocked(getSessionAndEngine).mockResolvedValue(
      Result.ok({
        flowSession: mockSession,
        flowSessionEngine: mockFlowSessionEngine,
      }),
    );

    vi.mocked(validateStepIdFlowNewEngine).mockReturnValue(Result.ok());

    const result = await getUserDataAndFlowNewEngine(mockRequest, mockURL);

    expect(result.isOk).toBe(true);
    expect(result.isOk ? result.value : undefined).toMatchObject({
      flow: {
        id: "/beratungshilfe/antrag",
        userVisitedValidationPage: false,
        useStepper: false,
        flowSessionEngine: mockFlowSessionEngine,
      },
      page: {
        stepId: "/finanzielle-angaben/kinder/uebersicht",
        arrayIndexes: [],
      },
    });
  });

  it("should return ok and with the trigger validation set to true if the meta configuration for the triggerValidation is true", async () => {
    vi.mocked(getSessionAndEngine).mockResolvedValue(
      Result.ok({
        flowSession: mockSession,
        flowSessionEngine: mockFlowSessionEngine,
      }),
    );

    vi.mocked(validateStepIdFlowNewEngine).mockReturnValue(Result.ok());
    vi.mocked(getMetaConfigurationByStepId).mockReturnValue({
      triggerValidation: true,
    });

    const result = await getUserDataAndFlowNewEngine(
      new Request(
        "http://example.com/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/address",
      ),
      new URL(
        "http://example.com/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/address",
      ),
    );

    expect(result.isOk).toBe(true);
    expect(result.isOk ? result.value : undefined).toMatchObject({
      flow: {
        triggerValidation: true,
      },
    });
  });

  it("should return ok and with the trigger validation set to false if the meta configuration for the triggerValidation does not exist", async () => {
    vi.mocked(getSessionAndEngine).mockResolvedValue(
      Result.ok({
        flowSession: mockSession,
        flowSessionEngine: mockFlowSessionEngine,
      }),
    );

    vi.mocked(validateStepIdFlowNewEngine).mockReturnValue(Result.ok());
    vi.mocked(getMetaConfigurationByStepId).mockReturnValue({});

    const result = await getUserDataAndFlowNewEngine(
      new Request(
        "http://example.com/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/address",
      ),
      new URL(
        "http://example.com/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/address",
      ),
    );

    expect(result.isOk).toBe(true);
    expect(result.isOk ? result.value : undefined).toMatchObject({
      flow: {
        triggerValidation: false,
      },
    });
  });
});
