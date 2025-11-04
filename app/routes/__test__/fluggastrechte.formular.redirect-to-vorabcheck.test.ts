import type { LoaderFunctionArgs } from "react-router";
import { loader } from "~/routes/fluggastrechte.formular.redirect-to-vorabcheck";
import { getSessionManager } from "~/services/session.server";
import { mockRouteArgsFromRequest } from "./mockRouteArgsFromRequest";

vi.mock("~/services/session.server");

const mockGetSession = vi
  .fn()
  .mockReturnValue({ get: () => ({}), set: vi.fn() });
const mockDestroySession = vi.fn();

vi.mocked(getSessionManager).mockReturnValue({
  getSession: mockGetSession,
  commitSession: vi.fn(),
  destroySession: mockDestroySession,
});

describe("fluggastrechte/formular/redirect-to-vorabcheck route", () => {
  it("should destroy formular session", async () => {
    const request = new Request(
      "http://localhost:3000/fluggastrechte/formular/redirect-to-vorabcheck",
    );
    const mockArgs: LoaderFunctionArgs = mockRouteArgsFromRequest(request);
    await loader(mockArgs);
    expect(mockGetSession).toHaveBeenCalled();
    expect(mockDestroySession).toHaveBeenCalled();
    expect(getSessionManager).toHaveBeenCalled();
  });

  it("should redirect user to correct url", async () => {
    const request = new Request(
      "http://localhost:3000/fluggastrechte/formular/redirect-to-vorabcheck",
    );
    const mockArgs: LoaderFunctionArgs = mockRouteArgsFromRequest(request);
    const response = await loader(mockArgs);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(
      "/fluggastrechte/vorabcheck/start",
    );
  });
});
