import { USER_FEEDBACK_ID } from "~/components/content/userFeedback";
import { action } from "../action.send-feedback";
import { mockRouteArgsFromRequest } from "./mockRouteArgsFromRequest";
import {
  assertResponse,
  assertValidationError,
  isResponse,
} from "./isResponse";
import invariant from "tiny-invariant";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { createSession } from "react-router";
import {
  getSessionManager,
  mainSessionFromCookieHeader,
} from "~/services/session.server";
import { logWarning } from "~/services/logging";
import { ERROR_MESSAGE_TOKEN_FORM } from "~/services/security/csrf/validatedSession.server";

const mockCSRFToken = "mockCsrfToken";
const mockSession = createSession({
  [CSRFKey]: mockCSRFToken,
});
vi.stubEnv("PUBLIC_POSTHOG_API_KEY", "-");

vi.mock("~/services/session.server");
vi.mocked(mainSessionFromCookieHeader).mockResolvedValue(mockSession);
vi.mocked(getSessionManager).mockReturnValue({
  getSession: vi.fn().mockResolvedValue(mockSession),
  commitSession: vi.fn(),
} as any);

vi.mock("~/services/logging", () => ({
  logWarning: vi.fn(),
}));

const formData = new FormData();
formData.append("feedback", "feedback");
formData.append(CSRFKey, mockCSRFToken);

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

  it("should fail if feedback parameter does not exist in the body", async () => {
    const bodyWithoutFeedback = new FormData();
    bodyWithoutFeedback.append(CSRFKey, mockCSRFToken);

    const request = new Request(
      `http://localhost:3000/action/send-feedback?url=/asd&js=true`,
      { method: "POST", body: bodyWithoutFeedback },
    );

    const response = await action(mockRouteArgsFromRequest(request));
    assertValidationError(response);
    expect(response.init?.status).toBe(422);
  });

  it("should fail if CSRF token is missing in the body", async () => {
    const bodyWithoutCsrf = new FormData();
    bodyWithoutCsrf.append("feedback", "feedback");

    const request = new Request(
      `http://localhost:3000/action/send-feedback?url=/asd&js=true`,
      { method: "POST", body: bodyWithoutCsrf },
    );
    const response = await action(mockRouteArgsFromRequest(request)).catch(
      (err) => err,
    );
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(403);
    expect(logWarning).toHaveBeenCalledWith(ERROR_MESSAGE_TOKEN_FORM);
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
