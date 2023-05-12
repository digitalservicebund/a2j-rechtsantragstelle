import cms from "~/services/cms";
import Strapi from "~/services/cms/strapi";
import config from "~/services/config";
import FileCMS from "~/services/cms/file";

it("Expect strapi if invalid value", () => {
  config().CMS = "INVALID";
  expect(cms()).toBeInstanceOf(Strapi);
});

it("Expect strapi if strapi", () => {
  config().CMS = "STRAPI";
  expect(cms()).toBeInstanceOf(Strapi);
});

it("Expect file if file", () => {
  config().CMS = "FILE";
  expect(cms()).toBeInstanceOf(FileCMS);
});
