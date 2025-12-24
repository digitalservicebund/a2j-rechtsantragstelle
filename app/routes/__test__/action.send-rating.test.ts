import { getSessionManager } from "~/services/session.server";
import { action } from "../action.send-rating";
import { mockRouteArgsFromRequest } from "./mockRouteArgsFromRequest";
import {
  assertResponse,
  assertValidationError,
  isResponse,
} from "./isResponse";
import invariant from "tiny-invariant";

vi.mock("~/services/session.server");
vi.stubEnv("PUBLIC_POSTHOG_API_KEY", "-");

vi.mocked(getSessionManager).mockReturnValue({
  getSession: vi.fn().mockReturnValue({ get: () => ({}), set: vi.fn() }),
  commitSession: vi.fn(),
  destroySession: vi.fn(),
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
    const response = await action(mockRouteArgsFromRequest(request));
    invariant(
      !isResponse(response) && "success" in response.data,
      "Expected success field in data",
    );
    expect(response.data.success).toEqual(true);
  });

  it("returns redirect without JS", async () => {
    const ratingPath = "/relative/path#user-feedback-banner";
    const expectedPath = "/relative/path?wasHelpful=yes#user-feedback-banner";
    const request = new Request(
      `http://localhost:3000/action/send-rating?url=${ratingPath}&js=false`,
      options,
    );

    const response = await action(mockRouteArgsFromRequest(request));
    assertResponse(response);
    expect(response.status).toEqual(302);
    expect(response.headers.get("location")).toEqual(expectedPath);
  });

  it("fails for non-relative URLs", async () => {
    const request = new Request(
      `http://localhost:3000/action/send-rating?url=http://external.com&js=false`,
      options,
    );

    const response = await action(mockRouteArgsFromRequest(request));
    invariant(!isResponse(response), "Expected success field in data");
    expect(response.init?.status).toBe(400);
  });

  it("fails if wasHelpful parameter does not exist in the body", async () => {
    const optionsWithoutBody = { method: "POST", body: new URLSearchParams() };

    const request = new Request(
      `http://localhost:3000/action/send-rating?url=/asd&js=true`,
      optionsWithoutBody,
    );

    const response = await action(mockRouteArgsFromRequest(request));
    assertValidationError(response);
    expect(response.init?.status).toBe(422);
  });
});
