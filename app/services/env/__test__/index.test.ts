import { config as configServer } from "~/services/env/env.server";
import { config as configPublic } from "~/services/env/public";

beforeAll(() => {
  vi.stubEnv("STRAPI_API", "test://cms/api/");
  vi.stubEnv("COOKIE_SESSION_SECRET", "test-cookie-session-secret");
  vi.stubEnv("GERICHTSFINDER_ENCRYPTION_KEY", "test-encryption-key");
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe("server config", () => {
  it("derives STRAPI_HOST from STRAPI_API", () => {
    expect(configServer().STRAPI_HOST).toBe("test://cms");
  });

  it("enables session encryption by default", () => {
    expect(configServer().ENABLE_SESSION_ENCRYPTION).toBe(true);
  });
});

describe("public config", () => {
  it("defaults ENVIRONMENT to 'development'", () => {
    expect(configPublic().ENVIRONMENT).toBe("development");
  });
});
