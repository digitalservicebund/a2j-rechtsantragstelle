import { prefix, route, type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";
import {
  flowRoutes,
  newEngineFlowRoutes,
  newEngineVorabcheckRoutes,
  vorabcheckRoutes,
} from "./services/routing/flowRoutes";

export default [
  ...(await flatRoutes({
    ignoredRouteFiles: [
      "**/nachlass.erbschein.erbfolge.$.tsx",
      "**/nachlass.erbschein.erbfolge.ergebnis.$.tsx",
      "**/geld-einklagen.formular.$.tsx",
    ],
  })), // See routes folder & https://reactrouter.com/how-to/file-route-conventions
  ...prefix("beratungshilfe", [
    ...prefix("vorabcheck", newEngineVorabcheckRoutes("BHV")),
    ...prefix("antrag", flowRoutes("BHA")),
  ]),
  ...prefix("prozesskostenhilfe", [...prefix("formular", flowRoutes("PKH"))]),
  ...prefix("fluggastrechte", [
    ...prefix("vorabcheck", vorabcheckRoutes("FGRV")),
    ...prefix("formular", flowRoutes("FGRF")),
  ]),
  ...prefix("nachlass", [
    ...prefix("erbausschlagung/anfrage", newEngineFlowRoutes("NAA")),
    ...prefix(
      "erbausschlagung/gericht-finden",
      newEngineVorabcheckRoutes("NAGF"),
    ),
    ...prefix("erbschein/wegweiser", newEngineVorabcheckRoutes("NESW")),
    ...prefix("erbschein/nachlassgericht", newEngineVorabcheckRoutes("NESN")),
    ...prefix("erbschein/erbfolge", [
      route("ergebnis/*", "routes/nachlass.erbschein.erbfolge.ergebnis.$.tsx", {
        id: "nachlassErbfolgeResult",
      }),
      route("*", "routes/nachlass.erbschein.erbfolge.$.tsx", {
        id: "nachlassErbfolgeFlow",
      }),
    ]),
    ...prefix("erbschein/anfrage", [
      route("*", "routes/nachlass.erbschein.anfrage.$.tsx", {
        id: "nachlassAnfrageFlow",
      }),
      route("download/pdf", "routes/shared/pdfDownloadLoader.ts", {
        id: `pdfNachlassAnfrageFlow`,
      }),
      route("visualisierung", "routes/shared/visualisierung.ts", {
        id: `visNachlassAnfrageFlow`,
      }),
    ]),
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
