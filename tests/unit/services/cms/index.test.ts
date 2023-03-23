import cms from "~/services/cms";
import Strapi from "~/services/cms/strapi";
import config from "~/services/config";

it("Expect always strapi - regardless of configuration", () => {
  config().CMS = "NOTSTRAPI";
  expect(cms()).toBeInstanceOf(Strapi);
});
