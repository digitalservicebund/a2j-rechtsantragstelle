import { redirect } from "react-router";
import { action } from "~/routes/action.send-email";

vi.mock("react-router");
vi.mock("~/services/analytics/gdprCookie.server", () => ({
  consentCookieFromRequest: vi.fn(() => ({})),
}));
const setSessionMock = vi.fn();
const commitSessionMock = vi.fn();
vi.mock("~/services/session.server", () => ({
  getSessionManager: vi.fn(() => ({
    getSession: vi.fn(() => ({
      set: setSessionMock,
    })),
    commitSession: commitSessionMock,
  })),
}));

const redirectMock = vi.mocked(redirect);
const redirFunc = vi.fn();

const fetchMock = vi.fn();
globalThis.fetch = fetchMock;
const mockUrl = "/flowId/stepId";

describe("/action/send-email route", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    redirectMock.mockImplementation(redirFunc);
  });
  it("should return a validation error for an invalid email", async () => {
    const formData = new FormData();
    formData.append("_url", mockUrl);
    formData.append("email", "doesntWork@");
    const request = new Request("http://localhost:3000", {
      method: "post",
      body: formData,
    });
    await action({ request, params: {}, context: {} });
    expect(redirFunc).toHaveBeenCalledWith(`${mockUrl}?invalid`, {
      headers: {},
    });
  });

  it("should make a call to the formbricks api given a valid email", async () => {
    fetchMock.mockResolvedValue({ ok: true });
    const formData = new FormData();
    formData.append("_url", mockUrl);
    formData.append("email", "hello@world.com");
    const request = new Request("http://localhost:3000", {
      method: "post",
      body: formData,
    });
    await action({ request, params: {}, context: {} });
    expect(fetchMock).toHaveBeenCalled();
    expect(redirFunc).toHaveBeenCalledWith(`${mockUrl}?success`, {
      headers: {},
    });
  });

  it("should return an error if the formbricks api call fails", async () => {
    fetchMock.mockResolvedValue({ ok: false });
    const formData = new FormData();
    formData.append("_url", mockUrl);
    formData.append("email", "hello@world.com");
    const request = new Request("http://localhost:3000", {
      method: "post",
      body: formData,
    });
    await action({ request, params: {}, context: {} });
    expect(redirFunc).toHaveBeenCalledWith(`${mockUrl}?error`, {
      headers: {},
    });
  });
});
