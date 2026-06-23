import { type MergeWithCustomizer } from "lodash";
import * as reactRouter from "react-router";
import { type FlowId } from "~/domains/flowIds";
import { cacheControlHeaderKey } from "~/rootHeaders";
import * as gdprCookie from "~/services/analytics/gdprCookie.server";
import { lastStepKey } from "~/services/flow/constants";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import * as sessionServices from "~/services/session.server";

vi.mock("~/services/session.server/redis");

vi.mock("react-router", { spy: true });
const mockSessionData = (session: reactRouter.Session) => {
  vi.mocked(reactRouter.createSessionStorage).mockImplementation(() => ({
    getSession: vi.fn().mockResolvedValue(session),
    commitSession: vi.fn(),
    destroySession: vi.fn(),
  }));
};

const trackingCookieValueSpy = vi.spyOn(gdprCookie, "trackingCookieValue");

const mergeCustomizer: MergeWithCustomizer = (objValue, _srcValue, key) =>
  key === "a" ? objValue : undefined;

const baseUrl = "http://localhost:3000";
const mockURL = new URL(baseUrl);

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
      const mockSession = reactRouter.createSession({});
      mockSessionData(mockSession);
      const { csrf } = await sessionServices.initializeMainSession(
        new Request(baseUrl),
        mockURL,
      );
      expect(csrf).toBeTypeOf("string");
    });

    it("should skip setting the CSRF token if one exists", async () => {
      const mockSession = reactRouter.createSession({
        [CSRFKey]: "existing-token",
      });
      mockSessionData(mockSession);
      const { csrf } = await sessionServices.initializeMainSession(
        new Request(baseUrl),
        mockURL,
      );
      expect(csrf).toBe("existing-token");
    });

    it("should return the first CSRF token if the session contains an array of CSRF tokens", async () => {
      const mockSession = reactRouter.createSession({
        [CSRFKey]: ["token1", "token2"],
      });
      mockSessionData(mockSession);
      const { csrf } = await sessionServices.initializeMainSession(
        new Request(baseUrl),
        mockURL,
      );
      expect(csrf).toBe("token1");
    });

    it("should set the last visited step if inside of a flow", async () => {
      const mockSession = reactRouter.createSession({});
      mockSessionData(mockSession);
      const flowId: FlowId = "/beratungshilfe/antrag";
      await sessionServices.initializeMainSession(
        new Request(`${baseUrl}${flowId}/step1`),
        new URL(`${baseUrl}${flowId}/step1`),
      );
      const lastStep = mockSession.get(lastStepKey as never);
      expect(lastStep?.[flowId]).toBe("/step1");
    });

    it("should set the last visited step for multiple flows", async () => {
      const mockSession = reactRouter.createSession({});
      mockSessionData(mockSession);
      const flowId: FlowId = "/beratungshilfe/antrag";
      await sessionServices.initializeMainSession(
        new Request(`${baseUrl}${flowId}/step1`),
        new URL(`${baseUrl}${flowId}/step1`),
      );
      const lastStep = mockSession.get(lastStepKey as never);
      expect(lastStep?.[flowId]).toBe("/step1");

      const secondFlowId: FlowId = "/prozesskostenhilfe/formular";
      await sessionServices.initializeMainSession(
        new Request(`${baseUrl}${secondFlowId}/step1flow2`),
        new URL(`${baseUrl}${secondFlowId}/step1flow2`),
      );
      const updatedLastStep = mockSession.get(lastStepKey as never);
      expect(updatedLastStep?.[flowId]).toBe("/step1");
      expect(updatedLastStep?.[secondFlowId]).toBe("/step1flow2");
    });

    it("should skip setting the last visited state if the user is outside of a flow", async () => {
      const mockSession = reactRouter.createSession({});
      mockSessionData(mockSession);
      await sessionServices.initializeMainSession(
        new Request(`${baseUrl}/non-flow-route/step1`),
        new URL(`${baseUrl}/non-flow-route/step1`),
      );
      const lastStep = mockSession.get(lastStepKey as never);
      expect(lastStep).toBeUndefined();
    });

    it("should return feedback data if stored in the session", async () => {
      const mockSession = reactRouter.createSession({});
      mockSessionData(mockSession);
      const routeName = "/some-route";
      const { feedback } = await sessionServices.initializeMainSession(
        new Request(`${baseUrl}${routeName}`),
        new URL(`${baseUrl}${routeName}`),
      );
      expect(feedback).toEqual({ result: undefined, state: "showRating" });

      const mockSessionWithData = reactRouter.createSession({
        bannerState: { [routeName]: "hideRating" },
        wasHelpful: { [routeName]: "positive" },
      });
      mockSessionData(mockSessionWithData);
      const { feedback: feedbackWithData } =
        await sessionServices.initializeMainSession(
          new Request(`${baseUrl}${routeName}`),
          new URL(`${baseUrl}${routeName}`),
        );
      expect(feedbackWithData).toEqual({
        result: "positive",
        state: "hideRating",
      });
    });

    it("should retrieve the tracking consent cookie from the request", async () => {
      trackingCookieValueSpy.mockResolvedValue("true");
      const mockSession = reactRouter.createSession({});
      mockSessionData(mockSession);
      const { trackingConsent, headers } =
        await sessionServices.initializeMainSession(
          new Request(`${baseUrl}/some-route`, {
            headers: {
              Cookie: "tracking-consent=mock-consent-value",
            },
          }),
          new URL(`${baseUrl}/some-route`),
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
