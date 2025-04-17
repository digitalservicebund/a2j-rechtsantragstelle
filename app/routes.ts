import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// This can be extended using route("/hello", "routes/hello.tsx")
// See https://remix.run/docs/en/main/start/future-flags#v3_routeconfig

export default [
  ...(await flatRoutes({ rootDirectory: "routes" })),
] satisfies RouteConfig;
