import { Result } from "true-myth";
import { postValidationFlowAction } from "~/services/flow/userFlowAction/postValidationFlowAction";
import { validateFormUserData } from "~/services/flow/userFlowAction/validateFormUserData";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager, updateSession } from "~/services/session.server";
import { runVorabcheckAction } from "../newEngineVorabcheck.server";
import { mockRouteArgsFromRequest } from "../../__test__/mockRouteArgsFromRequest";
import { assertResponse } from "~/routes/__test__/isResponse";

vi.mock("~/services/security/csrf/validatedSession.server", () => ({
  validatedSession: vi.fn(),
}));
vi.mock("~/services/session.server");
vi.mock("~/services/flow/userFlowAction/validateFormUserData");
vi.mock("~/services/flow/userFlowAction/postValidationFlowAction");

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
