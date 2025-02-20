import { describe, it, expect, beforeEach } from "vitest";
import { logError } from "~/services/logging";
import { getRedisStatus } from "~/services/session.server/redis";
import { loader } from "../health";
vi.mock("~/services/session.server/redis", () => {
  return {
    getRedisStatus: vi.fn(),
  };
});

const mockConfigObject = {
  CMS: "STRAPI",
  STRAPI_HOST: "http://fake-strapi.example",
  STRAPI_ACCESS_KEY: "FAKE_KEY",
};

vi.mock("~/services/env/env.server", () => {
  return {
    config: vi.fn(() => mockConfigObject),
  };
});

vi.mock("~/services/logging", () => {
  return {
    logError: vi.fn(),
  };
});

describe("loader (alternate mocking approach)", () => {
  const fetchSpy = vi.spyOn(global, "fetch");
  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("returns 503 if Redis is not ready", async () => {
    vi.mocked(getRedisStatus).mockReturnValue("wait");
    const response = loader();
    expect(response.status).toBe(503);
    const text = await response.text();
    expect(text).toContain("ERROR: Redis connection not ready");
    expect(logError).toHaveBeenCalledWith({
      error: "Redis connection not ready",
    });
  });

  it.skip("performs Strapi health check if CMS is STRAPI, returns 503 if check fails", async () => {
    vi.mocked(getRedisStatus).mockReturnValue("ready");

    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const response = loader();
    expect(fetchSpy).toHaveBeenCalledWith(
      "http://fake-strapi.example/_health",
      expect.objectContaining({
        headers: {
          Authorization: "Bearer + FAKE_KEY",
        },
      }),
    );
    expect(response.status).toBe(503);
    const text = await response.text();
    expect(text).toContain("Health check failed with status 500");
    expect(logError).toHaveBeenCalledWith({
      error: "Health check failed with status 500",
    });
  });

  it("returns success if Strapi health check passes", async () => {
    vi.mocked(getRedisStatus).mockReturnValue("ready");
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 200,
    } as Response);

    const response = loader();
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBe("I'm fine, thanks for asking :)");
  });

  it("skips Strapi check if CMS is something else", async () => {
    vi.mocked(getRedisStatus).mockReturnValue("ready");
    mockConfigObject.CMS = "Wordpress";
    const response = loader();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBe("I'm fine, thanks for asking :)");
  });
});
