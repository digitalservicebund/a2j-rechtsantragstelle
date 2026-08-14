import { Result } from "true-myth";
import { postValidationFlowAction } from "~/services/flow/userFlowAction/postValidationFlowAction";
import { validateFormUserData } from "~/services/flow/userFlowAction/validateFormUserData";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager, updateSession } from "~/services/session.server";
import {
  loadVorabcheckData,
  runVorabcheckAction,
} from "../newEngineVorabcheck.server";
import { mockRouteArgsFromRequest } from "../../__test__/mockRouteArgsFromRequest";
import { assertResponse } from "~/routes/__test__/isResponse";
import { getUserDataAndFlowNewEngine } from "~/services/flow/userDataAndFlow/getUserDataAndFlowNewEngine";
import { type FlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { type Replacements } from "~/util/applyStringReplacement";
import { retrieveContentData } from "~/services/flow/contentData/retrieveContentData";

vi.mock("~/services/security/csrf/validatedSession.server", () => ({
  validatedSession: vi.fn(),
}));
vi.mock("~/services/session.server");
vi.mock("~/services/flow/userFlowAction/validateFormUserData");
vi.mock("~/services/flow/userFlowAction/postValidationFlowAction");
vi.mock("~/services/flow/userDataAndFlow/getUserDataAndFlowNewEngine");
vi.mock("~/services/flow/contentData/retrieveContentData");

const mockRetrieveContentData = vi.mocked(retrieveContentData);

// The session already holds the array item the user just submitted, resolved into
// the kinder array (isAlive="no"). The action must derive pageData.arrayIndexes from
// the URL so the kinder guards can route the dead child on to /hatteKinder.
const sessionData = {
  name: "Erblasser",
  familienstand: "ledig",
  hatteKinder: "yes",
  kinder: [{ name: "Kind", isAlive: "no" }],
  elternteile: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(validatedSession).mockResolvedValue(Result.ok());
  vi.mocked(validateFormUserData).mockResolvedValue(
    Result.ok({ userData: sessionData, migrationData: undefined }),
  );
  vi.mocked(postValidationFlowAction).mockResolvedValue(undefined);
  vi.mocked(getSessionManager).mockReturnValue({
    getSession: vi.fn().mockResolvedValue({ data: sessionData }),
    commitSession: vi.fn().mockResolvedValue({}),
    destroySession: vi.fn(),
  } as unknown as ReturnType<typeof getSessionManager>);
  vi.mocked(updateSession).mockReturnValue(undefined);
  vi.mocked(getUserDataAndFlowNewEngine).mockResolvedValue(
    Result.ok({
      userData: { pageData: { arrayIndexes: [0] } },
      flow: {
        id: "/nachlass/erbschein/erbfolge",
        flowSessionEngine: {
          currentStepId: "/kinder/0/daten",
          stepConfigMap: {},
        } as unknown as FlowSession<PageConfigMap>,
        validFlowPaths: [] as any,
        triggerValidation: false,
        userVisitedValidationPage: false,
        useStepper: false,
      },
      page: { stepId: "/kinder/0/daten", arrayIndexes: [0] },
      emailCaptureConsent: undefined,
      migration: { userData: undefined },
    }),
  );
  mockRetrieveContentData.mockResolvedValue({
    getCMSContent: vi.fn(),
    getFormElements: vi.fn(),
    getStepData: vi.fn(),
    getButtonNavigationNewEngine: vi.fn(),
    getProgressNewEngine: vi.fn(),
  } as any);
});

describe("loadVorabcheckData (new engine array flow)", () => {
  it("Optionally allows for injection of flow extras", async () => {
    const request = new Request(
      "http://localhost/nachlass/erbschein/erbfolge/kinder/0/daten",
      { method: "POST", body: new FormData() },
    );
    const mockReplacements: Replacements = { replacement1: "value1" };
    const extrasBuildReplacementsMock = vi.fn();

    extrasBuildReplacementsMock.mockImplementation(() => mockReplacements);
    const mockExtraData = { foo: "bar" };
    const extrasBuildLoaderDataMock = vi
      .fn()
      .mockImplementation(() => mockExtraData);
    const response = await loadVorabcheckData(
      {
        request,
        params: {},
        context: { get: vi.fn(), set: vi.fn() },
        pattern: "",
        url: new URL(request.url),
      },
      {
        buildReplacements: extrasBuildReplacementsMock,
        buildLoaderData: extrasBuildLoaderDataMock,
      },
    );
    expect(extrasBuildReplacementsMock).toHaveBeenCalled();
    expect(mockRetrieveContentData).toHaveBeenCalledWith(
      "vorab-check-pages",
      "/nachlass/erbschein/erbfolge/kinder/0/daten",
      {},
      { pageData: { arrayIndexes: [0] } },
      undefined,
      mockReplacements,
    );
    expect(extrasBuildLoaderDataMock).toHaveBeenCalled();
    expect((response as any).data.extraData).toBe(mockExtraData);
  });
});

describe("runVorabcheckAction (new engine array flow)", () => {
  it("routes a dead child from /kinder/#/daten on to /kinder/#/hatteKinder", async () => {
    const request = new Request(
      "http://localhost/nachlass/erbschein/erbfolge/kinder/0/daten",
      { method: "POST", body: new FormData() },
    );

    const response = await runVorabcheckAction(
      mockRouteArgsFromRequest(request),
    );

    assertResponse(response);
    expect(response.headers.get("Location")).toBe(
      "/nachlass/erbschein/erbfolge/kinder/0/hatteKinder",
    );
  });
});
