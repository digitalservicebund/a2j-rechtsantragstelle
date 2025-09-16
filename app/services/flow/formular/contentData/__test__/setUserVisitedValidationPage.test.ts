import {
  setUserVisitedValidationPage,
  userVisitedValidationPageKey,
} from "~/services/flow/formular/contentData/setUserVisitedValidationPage";
import { getSessionManager } from "~/services/session.server";

vi.mock("~/services/session.server");

const mockCommitSession = vi.fn();
const mockSessionSet = vi.fn();

vi.mocked(getSessionManager).mockReturnValue({
  getSession: vi.fn().mockResolvedValue({ set: mockSessionSet }),
  commitSession: mockCommitSession,
  destroySession: vi.fn(),
  getDebugId: vi.fn(),
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("setUserVisitedValidationPage", () => {
  it("should set an item in the flow session when trigger validation parameter is true", async () => {
    await setUserVisitedValidationPage(
      true,
      "/beratungshilfe/antrag",
      "cookieHeader",
    );
    expect(mockSessionSet).toHaveBeenCalledWith(
      userVisitedValidationPageKey,
      true,
    );
    expect(mockCommitSession).toHaveBeenCalled();
  });

  it("should not set an item in the flow session when trigger validation parameter is false", async () => {
    await setUserVisitedValidationPage(
      false,
      "/beratungshilfe/antrag",
      "cookieHeader",
    );

    expect(mockSessionSet).not.toHaveBeenCalledWith(
      userVisitedValidationPageKey,
      true,
    );
    expect(mockCommitSession).not.toHaveBeenCalled();
  });

  it("should not set an item in the flow session when trigger validation parameter is undefined", async () => {
    await setUserVisitedValidationPage(
      undefined,
      "/beratungshilfe/antrag",
      "cookieHeader",
    );

    expect(mockSessionSet).not.toHaveBeenCalledWith(
      userVisitedValidationPageKey,
      true,
    );
    expect(mockCommitSession).not.toHaveBeenCalled();
  });
});
