/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*", "**/shared.*.tsx"],
  tailwind: true,
  serverModuleFormat: "cjs",
  serverDependenciesToBundle: ["axios", "marked"],
};
