import type { TypedResponse } from "@remix-run/node";
import { getSessionManager } from "~/services/session.server";
import { action } from "../action.send-rating";

vi.mock("~/services/session.server");
vi.stubEnv("POSTHOG_API_KEY", "-");

vi.mocked(getSessionManager).mockReturnValue({
  getSession: vi.fn().mockReturnValue({ get: () => ({}), set: vi.fn() }),
  commitSession: vi.fn(),
  destroySession: vi.fn(),
  getDebugId: vi.fn(),
});

const formData = new FormData();
formData.append("wasHelpful", "yes");

const options = {
  method: "POST",
  body: formData,
};

describe("/action/send-rating route", () => {
  it("returns ok", async () => {
    const request = new Request(
      `http://localhost:3000/action/send-rating?url=/asd&js=true`,
      options,
    );
    const response = await action({ request, params: {}, context: {} });
    if (Object.hasOwn(response, "status")) {
      expect((response as TypedResponse).status).toEqual(200);
      expect((response as TypedResponse).ok).toBeTruthy();
    }
  });

  it("returns redirect without JS", async () => {
    const ratingPath = "/relative/path#user-feedback-banner";
    const request = new Request(
      `http://localhost:3000/action/send-rating?url=${ratingPath}&js=false`,
      options,
    );
    const response = await action({ request, params: {}, context: {} });
    if (Object.hasOwn(response, "status")) {
      expect((response as TypedResponse).status).toEqual(302);
      expect((response as TypedResponse).headers.get("location")).toEqual(
        ratingPath,
      );
    }
  });

  it("fails for non-relative URLs", async () => {
    const request = new Request(
      `http://localhost:3000/action/send-rating?url=http://external.com&js=false`,
      options,
    );
    const response = await action({ request, params: {}, context: {} });
    if (Object.hasOwn(response, "status")) {
      expect((response as TypedResponse).status).toEqual(400);
      expect((response as TypedResponse).ok).not.toBeTruthy();
    }
  });

  it("fails if wasHelpful parameter does not exist in the body", async () => {
    const optionsWithoutBody = { method: "POST", body: new URLSearchParams() };

    const request = new Request(
      `http://localhost:3000/action/send-rating?url=/asd&js=true`,
      optionsWithoutBody,
    );
    const response = await action({ request, params: {}, context: {} });
    expect(response.type).toBe("default");
  });
});
