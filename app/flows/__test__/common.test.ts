import { z } from "zod";
import { duplicateContext } from "~/flows/common";

describe("common utility functions", () => {
  describe("duplicateContext", () => {
    it("should duplicate a given context with a given prefix", () => {
      const context = {
        foo: z.string(),
        hello: z.string(),
      };
      const duplicatedContext = duplicateContext(context, "test");
      expect(Object.keys(duplicatedContext)).toHaveLength(4);
      expect(duplicatedContext.foo).toBeTruthy();
      expect(duplicatedContext["test-foo"]).toBeTruthy();
    });

    it('should skip prefixing a context key if that key is a "pageData"', () => {
      const context = {
        foo: z.string(),
        hello: z.string(),
        pageData: z.string(),
      };
      const duplicatedContext = duplicateContext(context, "test");
      expect(Object.keys(duplicatedContext)).toHaveLength(5);
      expect(duplicatedContext.foo).toBeTruthy();
      expect(duplicatedContext["test-foo"]).toBeTruthy();
      expect(duplicatedContext["test-pageData"]).toBeFalsy();
    });
  });
});
