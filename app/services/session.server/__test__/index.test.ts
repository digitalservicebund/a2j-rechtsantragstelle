import { type MergeWithCustomizer } from "lodash";
import { createSession } from "react-router";
import { updateSession } from "~/services/session.server";

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
});
