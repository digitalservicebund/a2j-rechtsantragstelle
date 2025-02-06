import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { submit } from "../submission.server";

vi.mock("dotenv", () => ({
  configDotenv: vi.fn(),
}));

vi.mock("../env/env.server", () => ({
  config: vi.fn(() => ({
    FIT_CONNECT_ADAPTER_ENDPOINT: "http://localhost:8080",
  })),
}));

describe("submit function", () => {
  const fetchSpy = vi.spyOn(global, "fetch");

  beforeEach(() => {
    fetchSpy.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("calls configDotenv, makes a successful request, and returns JSON data", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    } as Response);

    const data = await submit();

    expect(data).toEqual({ success: true });
    expect(fetchSpy).toHaveBeenCalledWith(
      `http://localhost:8080/api/sender/submit`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "hello World" }),
      }),
    );
  });

  it("throws an error if the response is not OK", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(submit()).rejects.toThrow(
      "POST request to http://localhost:8080/api/sender/submit failed with status 500",
    );
  });
});
