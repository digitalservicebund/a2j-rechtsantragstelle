import { type MergeWithCustomizer } from "lodash";
import * as reactRouter from "react-router";
import { type FlowId } from "~/domains/flowIds";
import { cacheControlHeaderKey } from "~/rootHeaders";
import * as gdprCookie from "~/services/analytics/gdprCookie.server";
import { lastStepKey } from "~/services/flow/constants";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import * as sessionServices from "~/services/session.server";

vi.mock("~/services/session.server/redis");

let session: reactRouter.Session;
vi.spyOn(reactRouter, "createSessionStorage").mockImplementation(() => ({
  getSession: vi.fn().mockResolvedValue(session),
  commitSession: vi.fn(),
  destroySession: vi.fn(),
}));

const trackingCookieValueSpy = vi.spyOn(gdprCookie, "trackingCookieValue");

const mergeCustomizer: MergeWithCustomizer = (objValue, _srcValue, key) =>
  key === "a" ? objValue : undefined;

describe("index", () => {
  describe("updateSession", () => {
    const mockUserData = { a: 1, b: 2 };
    it("should update a session with merged context data", () => {
      const mockSession = reactRouter.createSession(mockUserData);
      sessionServices.updateSession(mockSession, { a: 2, c: 3 });
      expect(mockSession.data).toEqual({ a: 2, b: 2, c: 3 });
    });

    it("should update a session with merged context data using a custom merge strategy", () => {
      const mockSession = reactRouter.createSession(mockUserData);
      sessionServices.updateSession(
        mockSession,
        { a: 2, c: 3 },
        mergeCustomizer,
      );
      expect(mockSession.data).toEqual({ a: 1, b: 2, c: 3 });
    });
  });

  describe("initializeMainSession", () => {
    it("should set the CSRF token if one doesn't exist", async () => {
      session = reactRouter.createSession({});
      const { csrf } = await sessionServices.initializeMainSession(
        new Request("http://localhost:3000"),
        "",
      );
      expect(csrf).toBeTypeOf("string");
    });

    it("should skip setting the CSRF token if one exists", async () => {
      session = reactRouter.createSession({ [CSRFKey]: "existing-token" });
      const { csrf } = await sessionServices.initializeMainSession(
        new Request("http://localhost:3000"),
        "",
      );
      expect(csrf).toBe("existing-token");
    });

    it("should set the last visited step if inside of a flow", async () => {
      session = reactRouter.createSession({});
      const flowId: FlowId = "/beratungshilfe/antrag";
      await sessionServices.initializeMainSession(
        new Request("http://localhost:3000"),
        `${flowId}/step1`,
      );
      const lastStep = session.get(lastStepKey);
      expect(lastStep?.[flowId]).toBe("/step1");
    });

    it("should skip setting the last visited state if the user is outside of a flow", async () => {
      session = reactRouter.createSession({});
      await sessionServices.initializeMainSession(
        new Request("http://localhost:3000"),
        "non-flow-route/step1",
      );
      const lastStep = session.get(lastStepKey);
      expect(lastStep).toBeUndefined();
    });

    it("should return feedback data if stored in the session", async () => {
      session = reactRouter.createSession({});
      const { feedback } = await sessionServices.initializeMainSession(
        new Request("http://localhost:3000"),
        "some-route",
      );
      expect(feedback).toEqual({ result: undefined, state: "showRating" });

      const routeName = "some-route";
      session = reactRouter.createSession({
        bannerState: { [routeName]: "hideRating" },
        wasHelpful: { [routeName]: "positive" },
      });
      const { feedback: feedbackWithData } =
        await sessionServices.initializeMainSession(
          new Request("http://localhost:3000"),
          routeName,
        );
      expect(feedbackWithData).toEqual({
        result: "positive",
        state: "hideRating",
      });
    });

    it("should retrieve the tracking consent cookie from the request", async () => {
      trackingCookieValueSpy.mockResolvedValue("true");
      session = reactRouter.createSession({});
      const { trackingConsent, headers } =
        await sessionServices.initializeMainSession(
          new Request("http://localhost:3000", {
            headers: {
              Cookie: "tracking-consent=mock-consent-value",
            },
          }),
          "some-route",
        );
      expect(trackingCookieValueSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          request: expect.any(Request),
        }),
      );
      expect(trackingConsent).toBe("true");
      expect(headers.get(cacheControlHeaderKey)).toBe("false");
    });
  });
});
