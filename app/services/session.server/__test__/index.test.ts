import { createSession } from "@remix-run/node";
import { MergeWithCustomizer } from "lodash";
import { updateSession } from "~/services/session.server";

describe("index", () => {
  describe("updateSession", () => {
    it("should update a session with merged context data", () => {
      const mockSession = createSession({
        a: 1,
        b: 2,
      });

      const mockContext = {
        a: 2,
        c: 3,
      };
      updateSession(mockSession, mockContext);
      expect(mockSession.data).toEqual({
        a: 2,
        b: 2,
        c: 3,
      });
    });

    it("should update a session with merged context data using a custom merge strategy", () => {
      const mockSession = createSession({
        a: 1,
        b: 2,
      });

      const mockContext = {
        a: 2,
        c: 3,
      };
      const mergeCustomizer: MergeWithCustomizer = (
        objValue,
        _srcValue,
        key,
      ) => {
        if (key === "a") {
          return objValue;
        }
      };
      updateSession(mockSession, mockContext, mergeCustomizer);
      expect(mockSession.data).toEqual({
        a: 1,
        b: 2,
        c: 3,
      });
    });
  });
});
