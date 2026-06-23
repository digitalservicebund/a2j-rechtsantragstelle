import { prefix, route, type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";
import {
  flowAndResultRoutes,
  flowRoutes,
  vorabcheckRoutes,
} from "./services/routing/flowRoutes";

export default [
  ...(await flatRoutes({
    ignoredRouteFiles: [
      "**/nachlass.erbschein.erbfolge.$.tsx",
      "**/nachlass.erbschein.erbfolge.ergebnis.$.tsx",
    ],
  })), // See routes folder & https://reactrouter.com/how-to/file-route-conventions
  ...prefix("beratungshilfe", [
    ...prefix("vorabcheck", vorabcheckRoutes("BHV")),
    ...prefix("antrag", flowRoutes("BHA")),
  ]),
  ...prefix("prozesskostenhilfe", [...prefix("formular", flowRoutes("PKH"))]),
  ...prefix("fluggastrechte", [
    ...prefix("vorabcheck", vorabcheckRoutes("FGRV")),
    ...prefix("formular", flowRoutes("FGRF")),
  ]),
  ...prefix("erbschein", [
    ...prefix("wegweiser", vorabcheckRoutes("ESW")),
    ...prefix("nachlassgericht", vorabcheckRoutes("ESN")),
  ]),
  ...prefix("nachlass", [
    ...prefix("erbausschlagung/anfrage", flowRoutes("NAA")),
    ...prefix("erbausschlagung/gericht-finden", vorabcheckRoutes("NAGF")),
    ...prefix("erbschein/erbfolge", [
      route("ergebnis/*", "routes/nachlass.erbschein.erbfolge.ergebnis.$.tsx", {
        id: "nachlassErbfolgeResult",
      }),
      route("*", "routes/nachlass.erbschein.erbfolge.$.tsx", {
        id: "nachlassErbfolgeFlow",
      }),
    ]),
  ]),
  ...prefix("kontopfaendung", [
    ...prefix("wegweiser", vorabcheckRoutes("KPW")),
    ...prefix("pkonto/antrag", flowRoutes("KPPA")),
  ]),
  ...prefix("geld-einklagen", [
    ...prefix("formular", flowAndResultRoutes("GEF")),
  ]),
] satisfies RouteConfig;
