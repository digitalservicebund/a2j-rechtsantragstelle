import { prefix, route, type RouteConfig } from "@react-router/dev/routes";
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
  ...prefix("erbausschlagung", [
    ...prefix("anfrage", [
      route("*", "routes/erbausschlagung.anfrage.$.tsx", {
        id: "flowEAA",
      }),
      route("download/pdf", "routes/shared/pdfDownloadLoader.ts", {
        id: "pdfEAA",
      }),
    ]),
    ...prefix("gericht-finden", vorabcheckRoutes("EAGF")),
  ]),
  ...prefix("erbschein", [
    ...prefix("wegweiser", vorabcheckRoutes("ESW")),
    ...prefix("nachlassgericht", vorabcheckRoutes("ESN")),
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
    ...prefix("wegweiser", vorabcheckRoutes("KPW")),
    ...prefix("pkonto/antrag", flowRoutes("KPPA")),
  ]),
  ...prefix("geld-einklagen", [
    ...prefix("anwaltschaft", flowRoutes("GEA")),
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
