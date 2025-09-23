import { index, route } from "@react-router/dev/routes";

export const vorabcheckRoutes = (idPostfix: string) => [
  index("routes/shared/lastFlowStepLoader.ts", { id: `index${idPostfix}` }),
  route("visualisierung", "routes/shared/visualisierung.ts", {
    id: `viz${idPostfix}`,
  }),
  route("*", "routes/shared/vorabcheck.ts", { id: `flow${idPostfix}` }),
  route("ergebnis/*", "routes/shared/result.ts", { id: `res${idPostfix}` }),
];

export const flowRoutes = (idPostfix: string) => [
  index("routes/shared/lastFlowStepLoader.ts", { id: `index${idPostfix}` }),
  route("*", "routes/shared/formular.ts", { id: `flow${idPostfix}` }),
  route("download/pdf", "routes/shared/pdfDownloadLoader.ts", {
    id: `pdf${idPostfix}`,
  }),
  route("visualisierung", "routes/shared/visualisierung.ts", {
    id: `vis${idPostfix}`,
  }),
];

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
