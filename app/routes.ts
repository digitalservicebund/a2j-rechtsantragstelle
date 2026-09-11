import { prefix, route, type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";
import {
  flowRoutes,
  newEngineFlowRoutes,
  newEngineVorabcheckRoutes,
} from "./services/routing/flowRoutes";

export default [
  ...(await flatRoutes()), // See routes folder & https://reactrouter.com/how-to/file-route-conventions
  ...prefix("beratungshilfe", [
    ...prefix("vorabcheck", newEngineVorabcheckRoutes("BHV")),
    ...prefix("antrag", flowRoutes("BHA")),
  ]),
  ...prefix("prozesskostenhilfe", [...prefix("formular", flowRoutes("PKH"))]),
  ...prefix("fluggastrechte", [
    ...prefix("vorabcheck", newEngineVorabcheckRoutes("FGRV")),
    ...prefix("formular", flowRoutes("FGRF")),
  ]),
  ...prefix("erbausschlagung", [
    ...prefix("anfrage", newEngineFlowRoutes("EAA")),
    ...prefix("gericht-finden", newEngineVorabcheckRoutes("EAGF")),
  ]),
  ...prefix("erbschein", [
    ...prefix("wegweiser", newEngineVorabcheckRoutes("ESW")),
    ...prefix("nachlassgericht", newEngineVorabcheckRoutes("ESN")),
    ...prefix("erbfolge", [
      route("ergebnis/*", "routes/erbschein.erbfolge.ergebnis.$.tsx", {
        id: "erbfolgeResult",
      }),
      route("*", "routes/erbschein.erbfolge.$.tsx", {
        id: "erbfolgeFlow",
      }),
    ]),
    ...prefix("anfrage", [
      route("*", "routes/erbschein.anfrage.$.tsx", {
        id: "ErbscheinAnfrageFlow",
      }),
      route("download/pdf", "routes/shared/pdfDownloadLoader.ts", {
        id: `pdfErbscheinAnfrageFlow`,
      }),
    ]),
  ]),
  ...prefix("kontopfaendung", [
    ...prefix("wegweiser", newEngineVorabcheckRoutes("KPW")),
    ...prefix("pkonto/antrag", newEngineFlowRoutes("KPPA")),
  ]),
  ...prefix("geld-einklagen", [
    ...prefix("formular", [
      route("*", "routes/geld-einklagen.formular.$.tsx", { id: `flowGEF` }),
      route("download/pdf", "routes/shared/pdfDownloadLoader.ts", {
        id: `pdfGEF`,
      }),
      route(":path/:path2/ergebnis/*", "routes/shared/newEngineResult.ts", {
        id: `resGEF`,
      }),
    ]),
  ]),
] satisfies RouteConfig;
