import { route } from "@react-router/dev/routes";

export const flowRoutes = (idPostfix: string) => [
  route("*", "routes/shared/formular.ts", { id: `flow${idPostfix}` }),
  route("download/pdf", "routes/shared/pdfDownloadLoader.ts", {
    id: `pdf${idPostfix}`,
  }),
];

export const vorabcheckRoutes = (idPostfix: string) => [
  route("*", "routes/shared/vorabcheck.ts", {
    id: `flow${idPostfix}`,
  }),
  route("ergebnis/*", "routes/shared/result.ts", {
    id: `res${idPostfix}`,
  }),
];
