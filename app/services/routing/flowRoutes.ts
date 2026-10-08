import { index, route } from "@react-router/dev/routes";

export const flowAndResultRoutes = (idPostfix: string) => [
  index("routes/shared/lastFlowStepLoader.ts", { id: `index${idPostfix}` }),
  route("*", "routes/shared/formular.ts", { id: `flow${idPostfix}` }),
  route("download/pdf", "routes/shared/pdfDownloadLoader.ts", {
    id: `pdf${idPostfix}`,
  }),
  route("visualisierung", "routes/shared/visualisierung.ts", {
    id: `vis${idPostfix}`,
  }),
  route(":path/:path2/ergebnis/*", "routes/shared/result.ts", {
    id: `res${idPostfix}`,
  }),
];

export const flowRoutes = (idPostfix: string) => [
  route("*", "routes/shared/newEngineFormular.ts", { id: `flow${idPostfix}` }),
  route("download/pdf", "routes/shared/pdfDownloadLoader.ts", {
    id: `pdf${idPostfix}`,
  }),
];

export const vorabcheckRoutes = (idPostfix: string) => [
  route("*", "routes/shared/newEngineVorabcheck.ts", {
    id: `flow${idPostfix}`,
  }),
  route("ergebnis/*", "routes/shared/newEngineResult.ts", {
    id: `res${idPostfix}`,
  }),
];
