import axios from "axios";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { logError } from "~/services/logging";
import { getRedisStatus } from "~/services/session.server/redis";
import { loader } from "../health";

vi.mock("axios");
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

describe("loader (using Axios)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 503 if Redis is not ready", async () => {
    vi.mocked(getRedisStatus).mockReturnValue("wait");

    const response = await loader();
    expect(response.status).toBe(503);
    const text = await response.text();
    expect(text).toContain("ERROR: Redis connection not ready");
    expect(logError).toHaveBeenCalledWith({
      error: "Redis connection not ready",
    });
  });

  it("performs Strapi health check if CMS is STRAPI, returns 503 if check fails", async () => {
    vi.mocked(getRedisStatus).mockReturnValue("ready");

    vi.mocked(axios.get).mockRejectedValueOnce(
      new Error("Request failed with status code 500"),
    );

    const response = await loader();

    expect(axios.get).toHaveBeenCalledWith(
      "http://fake-strapi.example/_health",
      expect.objectContaining({
        headers: {
          Authorization: "Bearer " + mockConfigObject.STRAPI_ACCESS_KEY,
        },
        validateStatus: expect.any(Function),
      }),
    );
    expect(response.status).toBe(503);
    const text = await response.text();
    expect(text).toContain("ERROR");
    expect(logError).toHaveBeenCalledWith({
      message: "healthcheck ❌",
      error: expect.any(Error),
    });
  });

  it("returns success if Strapi health check passes", async () => {
    vi.mocked(getRedisStatus).mockReturnValue("ready");

    vi.mocked(axios.get).mockResolvedValueOnce({
      status: 200,
    });

    const response = await loader();
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBe("I'm fine, thanks for asking :)");
  });

  it("skips Strapi check if CMS is something else", async () => {
    vi.mocked(getRedisStatus).mockReturnValue("ready");
    mockConfigObject.CMS = "Wordpress";

    const response = await loader();
    expect(axios.get).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBe("I'm fine, thanks for asking :)");
  });
});
