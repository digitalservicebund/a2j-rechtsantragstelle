import { type MergeWithCustomizer } from "lodash";
import { createSession, type Session, type SessionData } from "react-router";
import { type FlowId } from "~/domains/flowIds";
import { lastStepKey } from "~/services/flow/constants";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import {
  initializeMainSession,
  updateSession,
} from "~/services/session.server";

const mergeCustomizer: MergeWithCustomizer = (objValue, _srcValue, key) =>
  key === "a" ? objValue : undefined;

describe("index", () => {
  describe("updateSession", () => {
    const mockUserData = { a: 1, b: 2 };
    it("should update a session with merged context data", () => {
      const mockSession = createSession(mockUserData);
      updateSession(mockSession, { a: 2, c: 3 });
      expect(mockSession.data).toEqual({ a: 2, b: 2, c: 3 });
    });

    it("should update a session with merged context data using a custom merge strategy", () => {
      const mockSession = createSession(mockUserData);
      updateSession(mockSession, { a: 2, c: 3 }, mergeCustomizer);
      expect(mockSession.data).toEqual({ a: 1, b: 2, c: 3 });
    });
  });

  describe("initializeMainSession", () => {
    it("should set the CSRF token if one doesn't exist", async () => {
      const mockSession = createSession({});
      const { csrf } = await initializeMainSession(mockSession, "");
      expect(csrf).toBeTypeOf("string");
    });

    it("should skip setting the CSRF token if one exists", async () => {
      const mockSession = createSession({ [CSRFKey]: "existing-token" });
      const { csrf } = await initializeMainSession(mockSession, "");
      expect(csrf).toBe("existing-token");
    });

    it("should set the last visited step if inside of a flow", async () => {
      const mockSession: Session<SessionData, SessionData> = createSession({});
      const flowId: FlowId = "/beratungshilfe/antrag";
      await initializeMainSession(mockSession, `${flowId}/step1`);
      const lastStep = mockSession.get(lastStepKey);
      expect(lastStep?.[flowId]).toBe("/step1");
    });

    it("should skip setting the last visited state if the user is outside of a flow", async () => {
      const mockSession: Session<SessionData, SessionData> = createSession({});
      await initializeMainSession(mockSession, "non-flow-route/step1");
      const lastStep = mockSession.get(lastStepKey);
      expect(lastStep).toBeUndefined();
    });

    it("should return feedback data if stored in the session", async () => {
      const mockSession: Session<SessionData, SessionData> = createSession({});
      const { feedback } = await initializeMainSession(
        mockSession,
        "some-route",
      );
      expect(feedback).toEqual({ result: undefined, state: "showRating" });

      const routeName = "some-route";
      const mockSessionWithFeedback: Session<SessionData, SessionData> =
        createSession({
          bannerState: { [routeName]: "hideRating" },
          wasHelpful: { [routeName]: "positive" },
        });
      const { feedback: feedbackWithData } = await initializeMainSession(
        mockSessionWithFeedback,
        routeName,
      );
      expect(feedbackWithData).toEqual({
        result: "positive",
        state: "hideRating",
      });
    });
  });
});
