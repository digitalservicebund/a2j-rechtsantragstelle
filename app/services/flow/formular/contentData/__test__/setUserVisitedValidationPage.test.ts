import { setUserVisitedValidationPage } from "~/services/flow/formular/contentData/setUserVisitedValidationPage";
import { readyForValidationKey } from "~/services/flow/userDataAndFlow/getUserDataAndFlow";
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
    expect(mockSessionSet).toHaveBeenCalledWith(readyForValidationKey, true);
    expect(mockCommitSession).toHaveBeenCalled();
  });
});
