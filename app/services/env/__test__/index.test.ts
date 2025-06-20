import { config as configServer } from "~/services/env/env.server";
import { config as configPublic } from "~/services/env/public";

beforeAll(() => {
  vi.stubEnv("STRAPI_API", "test://cms/api/");
});

afterAll(() => {
  vi.unstubAllEnvs();
});

it("Expect server configuration to be available", () => {
  expect(configServer()).not.toBeNull();
});

it("Expect web configuration to be available", () => {
  expect(configPublic()).not.toBeNull();
});

it("Expect the server config to contain a valid url to strapi", () => {
  expect(configServer().STRAPI_API).toBe("test://cms/api/");
});
