import { schemaForFieldNames } from "../schemaForFieldNames";

describe("schemaForFieldNames", () => {
  test("should throw for pathnames without flowId", () => {
    expect(() => schemaForFieldNames([], "/not/a/flowId")).toThrow();
  });
});
