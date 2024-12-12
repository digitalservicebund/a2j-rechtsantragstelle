import type { LoaderFunctionArgs } from "@remix-run/node";
import { describe, it, expect } from "vitest";
import { loader } from "~/routes/link.$";

describe("link loader", () => {
  it('should redirect "pkh" to the correct path', () => {
    const mockArgs: LoaderFunctionArgs = {
      params: { "*": "pkh" },
      request: new Request("https://test.com/pkh"),
      context: {},
    };

    const response = loader(mockArgs);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(
      "/prozesskostenhilfe/direktlink",
    );
  });

  it("should throw a 404 response when no params are provided", () => {
    const mockArgs: LoaderFunctionArgs = {
      params: {},
      request: new Request("https://test.com"),
      context: {},
    };

    expect(() => loader(mockArgs)).toThrowError();

    try {
      loader(mockArgs);
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      expect((error as Response).status).toBe(404);
    }
  });

  it("should throw a 404 response for an unknown site", () => {
    const mockArgs: LoaderFunctionArgs = {
      params: { "*": "unknown-site" },
      request: new Request("https://test.com/unknown-site"),
      context: {},
    };

    expect(() => loader(mockArgs)).toThrowError();

    try {
      loader(mockArgs);
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      expect((error as Response).status).toBe(404);
    }
  });
});
