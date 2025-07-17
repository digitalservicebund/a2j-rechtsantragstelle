import {
  route,
  index,
  prefix,
  type RouteConfig,
} from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
  ...(await flatRoutes()), // See routes folder & https://reactrouter.com/how-to/file-route-conventions
  ...prefix("beratungshilfe", [
    ...prefix("vorabcheck", [
      index("routes/shared/lastFlowStepLoader.ts", { id: "indexBHV" }),
      route("visualisierung", "routes/shared/visualisierung.ts", {
        id: "visBHV ",
      }),
      route("*", "routes/shared/vorabcheck.ts", { id: "flowBHV" }),
      route("ergebnis/*", "routes/shared/result.ts", { id: "resBHV" }),
    ]),
    ...prefix("antrag", [
      index("routes/shared/lastFlowStepLoader.ts", { id: "indexBHA" }),
      route("visualisierung", "routes/shared/visualisierung.ts", {
        id: "visBHA",
      }),
      route("download/pdf", "routes/shared/pdfDownloadLoader.ts", {
        id: "pdfBHA",
      }),
      route("*", "routes/shared/formular.ts", { id: "flowBHA" }),
    ]),
  ]),
  ...prefix("prozesskostenhilfe", [
    ...prefix("formular", [
      route("download/pdf", "routes/shared/pdfDownloadLoader.ts", {
        id: "pdfPKH",
      }),
      route("*", "routes/shared/formular.ts", { id: "flowPKH" }),
    ]),
  ]),
  ...prefix("fluggastrechte", [
    ...prefix("vorabcheck", [
      index("routes/shared/lastFlowStepLoader.ts", { id: "indexFGRV" }),
      route("*", "routes/shared/vorabcheck.ts", { id: "flowFGRV" }),
      route("visualisierung", "routes/shared/visualisierung.ts", {
        id: "visFGRV",
      }),
      route("ergebnis/*", "routes/shared/result.ts", { id: "resFGRV" }),
    ]),
    ...prefix("formular", [
      route("*", "routes/shared/formular.ts", { id: "flowFGRF" }),
      route("download/pdf", "routes/shared/pdfDownloadLoader.ts", {
        id: "pdfFGRF",
      }),
      route("visualisierung", "routes/shared/visualisierung.ts", {
        id: "visFGRF",
      }),
    ]),
  ]),
  ...prefix("kontopfaendung/wegweiser", [
    route("*", "routes/shared/vorabcheck.ts", { id: "flowKPV" }),
    route("wegweiser/ergebnis/*", "routes/shared/result.ts", {
      id: "resKPV",
    }),
  ]),
  ...prefix("geld-einklagen", [
    ...prefix("vorabcheck", [
      index("routes/shared/lastFlowStepLoader.ts", { id: "indexGEV" }),
      route("*", "routes/shared/vorabcheck.ts", { id: "flowGEV" }),
      route("visualisierung", "routes/shared/visualisierung.ts", {
        id: "visGEV",
      }),
      route("ergebnis/*", "routes/shared/result.ts", { id: "resGEV" }),
    ]),
    ...prefix("formular", [
      index("routes/shared/lastFlowStepLoader.ts", { id: "indexGEF" }),
      route("*", "routes/shared/formular.ts", { id: "flowGEF" }),
      route("visualisierung", "routes/shared/visualisierung.ts", {
        id: "visGEF",
      }),
    ]),
  ]),
] satisfies RouteConfig;
