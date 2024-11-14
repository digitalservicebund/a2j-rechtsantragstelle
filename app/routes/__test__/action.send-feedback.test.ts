import { USER_FEEDBACK_ID } from "~/components/userFeedback";
import { getSessionManager } from "~/services/session.server";
import { action } from "../action.send-feedback";

vi.mock("~/services/session.server");
vi.stubEnv("POSTHOG_API_KEY", "-");

vi.mocked(getSessionManager).mockReturnValue({
  getSession: vi.fn().mockReturnValue({ get: () => ({}), set: vi.fn() }),
  commitSession: vi.fn(),
  destroySession: vi.fn(),
  getDebugId: vi.fn(),
});

const formData = new FormData();
formData.append("feedback", "feedback");

const options = {
  method: "POST",
  body: formData,
};

describe("/action/send-feedback route", () => {
  it("should fail for non-relative URLs", async () => {
    const request = new Request(
      `http://localhost:3000/action/send-feedback?url=http://external.com&js=false`,
      options,
    );
    const response = await action({ request, params: {}, context: {} });
    expect(response.status).toEqual(400);
    expect(response.ok).not.toBeTruthy();
  });

  it("should fail if feedback parameter does not exist in the body", async () => {
    const optionsWithoutBody = { method: "POST", body: new URLSearchParams() };

    const request = new Request(
      `http://localhost:3000/action/send-feedback?url=/asd&js=true`,
      optionsWithoutBody,
    );
    const response = await action({ request, params: {}, context: {} });
    expect(response.status).toEqual(422);
    expect(response.ok).not.toBeTruthy();
  });

  it("should return redirect to the location from the url parameter", async () => {
    const feedbackPath = "/relative/path";
    const request = new Request(
      `http://localhost:3000/action/send-feedback?url=${feedbackPath}&js=true`,
      options,
    );
    const response = await action({ request, params: {}, context: {} });
    expect(response.status).toEqual(302);
    expect(response.headers.get("location")).toEqual(feedbackPath);
  });

  it("should return redirect without JS from the url parameter and USER_FEEDBACK_ID value", async () => {
    const feedbackPath = "/relative/path";
    const request = new Request(
      `http://localhost:3000/action/send-feedback?url=${feedbackPath}&js=false`,
      options,
    );
    const response = await action({ request, params: {}, context: {} });
    expect(response.status).toEqual(302);
    expect(response.headers.get("location")).toEqual(
      `${feedbackPath}#${USER_FEEDBACK_ID}`,
    );
  });
});
