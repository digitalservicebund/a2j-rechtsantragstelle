import { config as configServer } from "~/services/env/env.server";
import { config as configWeb } from "~/services/env/web";

it("Expect server configuration to be available", () => {
  expect(configServer()).not.toBeNull();
});

it("Expect web configuration to be available", () => {
  expect(configWeb()).not.toBeNull();
});

it("Expect the server config to contain a valid url to strapi", () => {
  expect(configServer().STRAPI_API).toBe("http://localhost/api/");
});
