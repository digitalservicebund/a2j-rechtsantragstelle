// @vitest-environment node

import { serverOnly } from "../serverOnly";

describe("serverOnly", () => {
  // This test is split across multiple files due to separate vitest-environment
  test("returns value on server", () => {
    expect(serverOnly(true)).toBe(true);
  });
});
