import { USER_FEEDBACK_ID } from "~/components/content/userFeedback";
import {
  getSessionManager,
  mainSessionFromCookieHeader,
} from "~/services/session.server";
import { action } from "../action.send-feedback";
import { mockRouteArgsFromRequest } from "./mockRouteArgsFromRequest";
import {
  assertResponse,
  assertValidationError,
  isResponse,
} from "./isResponse";
import invariant from "tiny-invariant";
import { createSession, type Session } from "react-router";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { logWarning } from "~/services/logging";

vi.mock("~/services/session.server");
vi.stubEnv("PUBLIC_POSTHOG_API_KEY", "-");

vi.mocked(getSessionManager).mockReturnValue({
  getSession: vi.fn().mockReturnValue({ get: () => ({}), set: vi.fn() }),
  commitSession: vi.fn(),
  destroySession: vi.fn(),
});

const mockMainSessionFromCookieHeader = (sessionMocked: Session) => {
  vi.mocked(mainSessionFromCookieHeader).mockResolvedValue(sessionMocked);
};

vi.mock("~/services/logging", () => ({
  logWarning: vi.fn(),
}));

const formData = new FormData();
formData.append("feedback", "feedback");
const mockSession: Session = createSession();
mockMainSessionFromCookieHeader(mockSession);
mockSession.set(CSRFKey, "csrf");
formData.append(CSRFKey, "csrf");

const options = { method: "POST", body: formData };

describe("/action/send-feedback route", () => {
  it("should fail for non-relative URLs", async () => {
    const request = new Request(
      `http://localhost:3000/action/send-feedback?url=http://external.com&js=false`,
      options,
    );
    const response = await action(mockRouteArgsFromRequest(request));
    invariant(!isResponse(response), "Shouldn't be response");
    expect(response.init?.status).toBe(400);
  });

  it("should fail if the CSRF token isn't present in the body", async () => {
    const request = new Request(
      `http://localhost:3000/action/send-feedback?url=/asd&js=true`,
      {
        method: "POST",
        body: new FormData(),
      },
    );

    const response = await action(mockRouteArgsFromRequest(request)).catch(
      (error) => error,
    );
    assertResponse(response);
    expect(response.status).toBe(403);
    expect(logWarning).toHaveBeenCalledWith("Form: CSRF Token not included.");
  });

  it("should fail if feedback parameter does not exist in the body", async () => {
    const formData = new FormData();
    formData.append(CSRFKey, "csrf");

    const request = new Request(
      `http://localhost:3000/action/send-feedback?url=/asd&js=true`,
      { method: "POST", body: formData },
    );

    const response = await action(mockRouteArgsFromRequest(request));
    assertValidationError(response);
    expect(response.init?.status).toBe(422);
  });

  it("should return redirect to the location from the url parameter", async () => {
    const feedbackPath = "/relative/path";
    const request = new Request(
      `http://localhost:3000/action/send-feedback?url=${feedbackPath}&js=true`,
      options,
    );
    const response = await action(mockRouteArgsFromRequest(request));
    assertResponse(response);
    expect(response.status).toEqual(302);
    expect(response.headers.get("location")).toEqual(feedbackPath);
  });

  it("should return redirect without JS from the url parameter and USER_FEEDBACK_ID value", async () => {
    const feedbackPath = "/relative/path";
    const request = new Request(
      `http://localhost:3000/action/send-feedback?url=${feedbackPath}&js=false`,
      options,
    );

    const response = await action(mockRouteArgsFromRequest(request));
    assertResponse(response);
    expect(response.status).toEqual(302);
    expect(response.headers.get("location")).toEqual(
      `${feedbackPath}#${USER_FEEDBACK_ID}`,
    );
  });
});
