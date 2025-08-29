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

describe("setUserVisitedValidationPage", () => {
  it("should set an item in the flow session", async () => {
    await setUserVisitedValidationPage(
      "/beratungshilfe/antrag",
      "cookieHeader",
    );
    expect(mockSessionSet).toHaveBeenCalledWith(
      userVisitedValidationPageKey,
      true,
    );
    expect(mockCommitSession).toHaveBeenCalled();
  });
});
