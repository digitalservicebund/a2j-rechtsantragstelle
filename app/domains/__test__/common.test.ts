import { z } from "zod";
import { duplicateUserData } from "~/domains/common";

describe("common utility functions", () => {
  describe("duplicateUserData", () => {
    it("should duplicate a given userData with a given prefix", () => {
      const userData = {
        foo: z.string(),
        hello: z.string(),
      };
      const duplicatedUserData = duplicateUserData(userData, "test");
      expect(Object.keys(duplicatedUserData)).toHaveLength(4);
      expect(duplicatedUserData.foo).toBeTruthy();
      expect(duplicatedUserData["test-foo"]).toBeTruthy();
    });

    it('should skip prefixing a context key if that key is a "pageData"', () => {
      const userData = {
        foo: z.string(),
        hello: z.string(),
        pageData: z.string(),
      };
      const duplicatedUserData = duplicateUserData(userData, "test");
      expect(Object.keys(duplicatedUserData)).toHaveLength(5);
      expect(duplicatedUserData.foo).toBeTruthy();
      expect(duplicatedUserData["test-foo"]).toBeTruthy();
      expect(duplicatedUserData["test-pageData"]).toBeFalsy();
    });
  });
});
