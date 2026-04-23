import { createSession } from "react-router";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { getSessionManager } from "~/services/session.server";
import { anyUserData } from "~/services/session.server/anyUserData.server";

const mockSession = createSession({
  data: {
    userId: "123",
    __vaultKey: "vault",
    [CSRFKey]: "csrfToken",
  },
});

vi.mock("~/services/session.server", async () => ({
  ...(await vi.importActual("~/services/session.server")),
  getSessionManager: vi.fn(() => ({
    getSession: vi.fn().mockResolvedValue(mockSession),
  })),
}));

describe("anyUserData", () => {
  it("should return true if any session contains user data", async () => {
    const mockRequest = new Request("http://localhost", {
      headers: {
        Cookie: "",
      },
    });

    // Call the function and assert the result
    const result = await anyUserData(mockRequest);
    expect(result).toBe(true);
  });

  it("should return false if no session contains user data", async () => {
    vi.mocked(getSessionManager).mockReturnValue({
      getSession: vi.fn().mockResolvedValue({
        data: {
          __vaultKey: "vault",
          [CSRFKey]: "csrfToken",
        },
      }),
      commitSession: vi.fn(),
      destroySession: vi.fn(),
    });
    const mockRequest = new Request("http://localhost", {
      headers: {
        Cookie: "",
      },
    });

    // Call the function and assert the result
    const result = await anyUserData(mockRequest);
    expect(result).toBe(false);
  });
});
