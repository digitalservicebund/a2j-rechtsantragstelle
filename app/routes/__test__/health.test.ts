import { describe, it, expect, beforeEach } from "vitest";
import { loader } from "../health";

vi.mock("~/services/session.server/redis", () => {
  return {
    getRedisStatus: vi.fn(),
  };
});

vi.mock("~/services/env/env.server", () => {
  return {
    config: vi.fn(() => ({
      CMS: "STRAPI",
      STRAPI_HOST: "http://fake-strapi.example",
      STRAPI_ACCESS_KEY: "FAKE_KEY",
    })),
  };
});

vi.mock("~/services/logging", () => {
  return {
    logError: vi.fn(),
  };
});

describe("loader (alternate mocking approach)", async () => {
  const { getRedisStatus } = await vi.importMock<{
    getRedisStatus: () => string;
  }>("~/services/session.server/redis");

  const { config } = await vi.importMock<{
    config: () => {
      CMS: string;
      STRAPI_HOST: string;
      STRAPI_ACCESS_KEY: string;
    };
  }>("~/services/env/env.server");

  const { logError } = await vi.importMock<{
    logError: (arg: unknown) => void;
  }>("~/services/logging");

  const fetchSpy = vi.spyOn(global, "fetch");

  beforeEach(() => {
    fetchSpy.mockClear();
    logError.mockClear();
  });

  it("returns 503 if Redis is not ready", async () => {
    getRedisStatus.mockReturnValue("not-ready");
    const response = await loader();
    expect(response.status).toBe(503);
    const text = await response.text();
    expect(text).toContain("ERROR: Redis connection not ready");
    expect(logError).toHaveBeenCalledWith({
      error: "Redis connection not ready",
    });
  });

  it("performs Strapi health check if CMS is STRAPI, returns 503 if check fails", async () => {
    getRedisStatus.mockReturnValue("ready");
    config.mockReturnValue({
      CMS: "STRAPI",
      STRAPI_HOST: "http://fake-strapi.example",
      STRAPI_ACCESS_KEY: "FAKE_KEY",
    });

    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const response = await loader();
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
    getRedisStatus.mockReturnValue("ready");
    config.mockReturnValue({
      CMS: "STRAPI",
      STRAPI_HOST: "http://fake-strapi.example",
      STRAPI_ACCESS_KEY: "FAKE_KEY",
    });

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 200,
    } as Response);

    const response = await loader();
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBe("I'm fine, thanks for asking :)");
  });

  it("skips Strapi check if CMS is something else", async () => {
    getRedisStatus.mockReturnValue("ready");
    config.mockReturnValue({
      CMS: "OTHER",
      STRAPI_ACCESS_KEY: "FAKE_KEY",
      STRAPI_HOST: "http://fake-strapi.example",
    });

    const response = await loader();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBe("I'm fine, thanks for asking :)");
  });
});
