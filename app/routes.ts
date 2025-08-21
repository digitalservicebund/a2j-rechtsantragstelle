import { prefix, type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";
import { flowRoutes, vorabcheckRoutes } from "./services/routing/flowRoutes";

export default [
  ...(await flatRoutes()), // See routes folder & https://reactrouter.com/how-to/file-route-conventions
  ...prefix("beratungshilfe", [
    ...prefix("vorabcheck", vorabcheckRoutes("BHV")),
    ...prefix("antrag", flowRoutes("BHA")),
  ]),
  ...prefix("prozesskostenhilfe", [...prefix("formular", flowRoutes("PKH"))]),
  ...prefix("fluggastrechte", [
    ...prefix("vorabcheck", vorabcheckRoutes("FGRV")),
    ...prefix("formular", flowRoutes("FGRF")),
  ]),
  ...prefix("kontopfaendung/wegweiser", vorabcheckRoutes("KPW")),
  ...prefix("geld-einklagen", [
    ...prefix("vorabcheck", vorabcheckRoutes("GEV")),
  ]),
] satisfies RouteConfig;
