import { serverOnly } from "../serverOnly";

describe("serverOnly", () => {
  // This test is split across multiple files due to separate vitest-environment
  test("returns undefined on server", () => {
    expect(serverOnly(true)).toBeUndefined();
  });
});
