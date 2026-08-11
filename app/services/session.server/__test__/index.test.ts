import { type MergeWithCustomizer } from "lodash";
import * as reactRouter from "react-router";
import type * as ReactRouter from "react-router";
import { type FlowId } from "~/domains/flowIds";
import { cacheControlHeaderKey } from "~/rootHeaders";
import * as gdprCookie from "~/services/analytics/gdprCookie.server";
import { lastStepKey } from "~/services/flow/constants";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import * as sessionServices from "~/services/session.server";

vi.mock("~/services/session.server/redis");

const mockGetSession = vi.fn();

vi.mock("react-router", async (importActual) => {
  const actual = await importActual<typeof ReactRouter>();
  return {
    ...actual,
    createSessionStorage: vi.fn().mockImplementation(() => ({
      getSession: mockGetSession,
      commitSession: vi.fn(),
      destroySession: vi.fn(),
    })),
  };
});

const trackingCookieValueSpy = vi.spyOn(gdprCookie, "trackingCookieValue");

const mergeCustomizer: MergeWithCustomizer = (objValue, _srcValue, key) =>
  key === "a" ? objValue : undefined;

const baseUrl = "http://localhost:3000";
const mockURL = new URL(baseUrl);

describe("index", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
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
      mockGetSession.mockResolvedValue(reactRouter.createSession({}));
      const { csrf } = await sessionServices.initializeMainSession(
        new Request(baseUrl),
        mockURL,
      );
      expect(csrf).toBeTypeOf("string");
    });

    it("should skip setting the CSRF token if one exists", async () => {
      mockGetSession.mockResolvedValue(
        reactRouter.createSession({ [CSRFKey]: "existing-token" }),
      );
      const { csrf } = await sessionServices.initializeMainSession(
        new Request(baseUrl),
        mockURL,
      );
      expect(csrf).toBe("existing-token");
    });

    it("should return the first CSRF token if the session contains an array of CSRF tokens", async () => {
      mockGetSession.mockResolvedValue(
        reactRouter.createSession({ [CSRFKey]: ["token1", "token2"] }),
      );
      const { csrf } = await sessionServices.initializeMainSession(
        new Request(baseUrl),
        mockURL,
      );
      expect(csrf).toBe("token1");
    });

    it("should set the last visited step if inside of a flow", async () => {
      const session: reactRouter.Session = reactRouter.createSession({});
      mockGetSession.mockResolvedValue(session);
      const flowId: FlowId = "/beratungshilfe/antrag";
      await sessionServices.initializeMainSession(
        new Request(`${baseUrl}${flowId}/step1`),
        new URL(`${baseUrl}${flowId}/step1`),
      );
      const lastStep = session.get(lastStepKey);
      expect(lastStep?.[flowId]).toBe("/step1");
    });

    it("should set the last visited step for multiple flows", async () => {
      const session: reactRouter.Session = reactRouter.createSession({});
      mockGetSession.mockResolvedValue(session);
      const flowId: FlowId = "/beratungshilfe/antrag";
      await sessionServices.initializeMainSession(
        new Request(`${baseUrl}${flowId}/step1`),
        new URL(`${baseUrl}${flowId}/step1`),
      );
      const lastStep = session.get(lastStepKey);
      expect(lastStep?.[flowId]).toBe("/step1");

      const secondFlowId: FlowId = "/prozesskostenhilfe/formular";
      await sessionServices.initializeMainSession(
        new Request(`${baseUrl}${secondFlowId}/step1flow2`),
        new URL(`${baseUrl}${secondFlowId}/step1flow2`),
      );
      const updatedLastStep = session.get(lastStepKey);
      expect(updatedLastStep?.[flowId]).toBe("/step1");
      expect(updatedLastStep?.[secondFlowId]).toBe("/step1flow2");
    });

    it("should skip setting the last visited state if the user is outside of a flow", async () => {
      const session: reactRouter.Session = reactRouter.createSession({});
      mockGetSession.mockResolvedValue(session);
      await sessionServices.initializeMainSession(
        new Request(`${baseUrl}/non-flow-route/step1`),
        new URL(`${baseUrl}/non-flow-route/step1`),
      );
      const lastStep = session.get(lastStepKey);
      expect(lastStep).toBeUndefined();
    });

    it("should return feedback data if stored in the session", async () => {
      let session: reactRouter.Session = reactRouter.createSession({});
      mockGetSession.mockResolvedValue(session);
      const routeName = "/some-route";
      const { feedback } = await sessionServices.initializeMainSession(
        new Request(`${baseUrl}${routeName}`),
        new URL(`${baseUrl}${routeName}`),
      );
      expect(feedback).toEqual({ result: undefined, state: "showRating" });

      session = reactRouter.createSession({
        bannerState: { [routeName]: "hideRating" },
        wasHelpful: { [routeName]: "positive" },
      });
      mockGetSession.mockResolvedValue(session);
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
