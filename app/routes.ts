import { flatRoutes } from "@remix-run/fs-routes";
import { type RouteConfig } from "@remix-run/route-config";

// This can be extended using route("/hello", "routes/hello.tsx")
// See https://remix.run/docs/en/main/start/future-flags#v3_routeconfig

export default [
  ...(await flatRoutes({ rootDirectory: "routes" })),
] satisfies RouteConfig;
