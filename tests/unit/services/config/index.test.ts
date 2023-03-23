import config from "~/services/config";

it("Expect a configuration is available", () => {
  expect(config()).not.toBeNull();
});

it("Expect in the config a valid url to strapi", () => {
  expect(config().STRAPI_API).toBe("http://localhost/api/");
});
